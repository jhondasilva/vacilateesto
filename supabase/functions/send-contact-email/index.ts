import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  company: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email from:", name, email);

    // Enviar email usando Resend API directamente
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Media Kit Vacílate Esto <onboarding@resend.dev>",
        to: ["jhon@hacemosloquenosgusta.com"],
        subject: `Nueva solicitud de Media Kit - ${company || name}`,
        html: `
          <h1>Nueva solicitud de contacto - Media Kit</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company || "No especificada"}</p>
          <h2>Mensaje:</h2>
          <p>${message}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este mensaje fue enviado desde el Media Kit de Vacílate Esto</p>
        `,
      }),
    });

    const data = await res.json();
    console.log("Email sent successfully:", data);

    if (!res.ok) {
      throw new Error(data.message || "Error sending email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
