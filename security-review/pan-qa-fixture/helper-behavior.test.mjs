import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const source=readFileSync(new URL('./index.ts',import.meta.url),'utf8');
globalThis.Deno={env:{get:n=>n==='SUPABASE_URL'?'https://example.invalid':n==='SUPABASE_ANON_KEY'?'PUBLIC_TEST_KEY':n==='SUPABASE_SERVICE_ROLE_KEY'?'DUMMY_SERVICE_TEST_KEY':undefined},serve:()=>{}};
globalThis.__factory=()=>{};
const ts=source.replace(/^import \{ createClient \} from .*;$/m,'const createClient = globalThis.__factory;');
const js=stripTypeScriptTypes(ts,{mode:'strip'});
const {createQaHandler}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const run0={run_id:'run',admin_user_id:'owner',planned_user_id:'fixture',actual_user_id:'fixture',candidate_user_id:'fixture',auth_user_present:true,email:'pan-qa-0123456789abcdef@example.invalid',state:'bound',banned:false};
function fixture(options={}){
 const calls=[];let run=options.run===null?undefined:{...run0,...options.run};
 const rpc=async(name,args)=>{
  calls.push(['rpc',name,args]);
  if(name==='pan_qa_status')return {data:run?[run]:[],error:null};
  if(name==='pan_qa_begin'){run={...run0,actual_user_id:null,candidate_user_id:null,auth_user_present:false,state:'marker_set'};return {data:[{run_id:'run',planned_user_id:'fixture',email:run.email}]};}
  if(name==='pan_qa_record_created'){if(options.recordFail)return {error:{}};run.actual_user_id=args.p_created;return {data:'recorded'};}
  if(name==='pan_qa_revoke'){return options.revokeFail?{error:{}}:{data:1};}
  if(name==='pan_qa_confirm')return options.confirmFail?{error:{}}:{data:'bound'};
  if(name==='pan_qa_mark_banned')return options.markFail?{error:{}}:{data:'banned'};
  return {data:'closed'};
 };
 const factory=(url,key)=>{
  calls.push(['client',key]);
  if(key==='PUBLIC_TEST_KEY')return {auth:{getUser:async()=>({data:{user:options.invalid?null:{id:options.caller??'owner',email_confirmed_at:options.unconfirmed?null:'2026-10-27'}},error:null})},rpc:async(name)=>({data:name==='is_allowed_user'?(options.allowed??true):{access_mode:options.mode??'standard'},error:options.contextError?{}:null})};
  return {rpc, auth: {admin: {
   updateUserById: async(id,attrs)=>{calls.push(['ban',id,attrs]);return options.banFail?{error:{}}:{data:{user:{id}}};},
   createUser: async(attrs)=>{calls.push(['create',attrs.id]);const id=options.createdId??attrs.id;run.candidate_user_id=id;run.auth_user_present=true;return {data:{user:{id,email:attrs.email}}};}
  }}};
 };
 const request=(body,token='valid')=>new Request('https://example.invalid',{method:'POST',headers:token?{Authorization:'Bearer '+token}:{},body:JSON.stringify(body)});
 return {calls,call:async(body={action:'disable'},token='valid')=>{const res=await createQaHandler(factory)(request(body,token));return {status:res.status,body:await res.json()};}};
}
for(const [name,options,status] of [['invalid user',{invalid:true},401],['unconfirmed',{unconfirmed:true},403],['nonadmin',{allowed:false},403],['PAN account even accidental admin',{mode:'pan_readonly'},403],['context unavailable',{contextError:true},503]])test(name+' performs zero privileged operations',async()=>{const f=fixture(options);const r=await f.call();assert.equal(r.status,status);assert.equal(f.calls.filter(c=>c[0]==='client'&&c[1]==='DUMMY_SERVICE_TEST_KEY').length,0);assert.equal(f.calls.filter(c=>c[0]==='ban'||c[0]==='create').length,0);});
test('different run owner cannot ban',async()=>{const f=fixture({caller:'another-admin'});assert.equal((await f.call()).status,403);assert.equal(f.calls.filter(c=>c[0]==='ban').length,0);});
test('unknown identity input cannot ban',async()=>{const f=fixture();assert.equal((await f.call({action:'disable',user_id:'other'})).status,400);assert.equal(f.calls.filter(c=>c[0]==='ban').length,0);});
test('authorized disable bans only registered UUID',async()=>{const f=fixture();const r=await f.call();assert.equal(r.status,200);assert.equal(r.body.complete,true);assert.deepEqual(f.calls.filter(c=>c[0]==='ban').map(c=>c[1]),['fixture']);});
test('ban failure still revokes grant and reports pending',async()=>{const f=fixture({banFail:true});const r=await f.call();assert.equal(r.status,503);assert.equal(r.body.status,'cleanup_pending');assert.equal(r.body.banned,false);assert.equal(r.body.revoked,true);});
test('revocation failure never claims success',async()=>{const f=fixture({revokeFail:true});const r=await f.call();assert.equal(r.status,503);assert.equal(r.body.complete,false);});
test('unexpected created UUID is recorded then cleaned, never another identity',async()=>{const f=fixture({run:null,createdId:'new-unexpected'});const r=await f.call({action:'create',password:'dummy-'.repeat(8)});assert.equal(r.status,500);assert.equal(r.body.status,'create_failed_cleaned');assert.deepEqual(f.calls.filter(c=>c[0]==='ban').map(c=>c[1]),['new-unexpected']);const i=f.calls.findIndex(c=>c[0]==='rpc'&&c[1]==='pan_qa_record_created');const b=f.calls.findIndex(c=>c[0]==='ban');assert(i>=0&&i<b);});
test('failed provenance recording does not ban untracked account; grant still revoked',async()=>{const f=fixture({run:null,createdId:'unexpected',recordFail:true});const r=await f.call({action:'create',password:'dummy-'.repeat(8)});assert.equal(r.body.status,'cleanup_pending');assert.equal(r.body.banned,false);assert.equal(r.body.revoked,true);assert.equal(f.calls.filter(c=>c[0]==='ban').length,0);});
test('closed run is 410 with zero Auth mutation',async()=>{const f=fixture({run:{state:'closed'}});assert.equal((await f.call()).status,410);assert.equal(f.calls.filter(c=>c[0]==='ban'||c[0]==='create').length,0);});
