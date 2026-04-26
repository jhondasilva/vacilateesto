// Edge function: extrae datos estructurados de una foto de recibo usando Lovable AI (Gemini Vision)
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres un asistente que extrae datos estructurados de fotos de recibos, facturas o tickets de compra.
Devuelve SIEMPRE un JSON con esta forma exacta (usa null si no puedes determinar un campo):
{
  "merchant": string | null,
  "expense_date": string | null,         // formato YYYY-MM-DD
  "amount_total": number | null,         // monto total final pagado, en la moneda del recibo
  "currency": string | null,             // ISO 4217: USD, EUR, MXN, VES, etc.
  "amount_usd": number | null,           // si la moneda no es USD, intenta una conversión razonable; si no, null
  "category": string | null,             // una de: "comida", "transporte", "hospedaje", "produccion", "otros"
  "payment_method": string | null,       // una de: "tarjeta_corp", "tarjeta_personal", "efectivo", "transferencia", "otro"
  "description": string | null,          // resumen breve (máx 80 chars)
  "confidence": "alta" | "media" | "baja"
}
No incluyas texto fuera del JSON. No uses backticks.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(JSON.stringify({ error: "imageBase64 requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY no configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Extrae los datos del siguiente recibo. Devuelve solo el JSON." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit. Intenta en unos segundos." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "Sin créditos de IA. Recarga en Settings → Workspace." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const text = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, text);
      return new Response(JSON.stringify({ error: "Error del modelo de IA" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/^```json\s*|\s*```$/g, "").trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error("No se pudo parsear JSON del modelo:", raw);
        parsed = {};
      }
    }

    return new Response(JSON.stringify({ data: parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("extract-receipt error:", err);
    return new Response(JSON.stringify({ error: "Error procesando recibo" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
