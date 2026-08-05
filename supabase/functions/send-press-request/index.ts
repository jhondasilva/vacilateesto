import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PressRequest {
  full_name: string;
  outlet: string;
  email: string;
  phone?: string;
  request_type: string;
  event?: string;
  preferred_date?: string;
  message: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function validateInput(data: PressRequest): { valid: boolean; error?: string } {
  if (!data.full_name || typeof data.full_name !== "string" || data.full_name.length > 120) {
    return { valid: false, error: "Nombre inválido" };
  }
  if (!data.outlet || typeof data.outlet !== "string" || data.outlet.length > 160) {
    return { valid: false, error: "Medio inválido" };
  }
  if (!data.email || typeof data.email !== "string" || data.email.length > 255) {
    return { valid: false, error: "Correo inválido" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Formato de correo inválido" };
  }
  if (!data.request_type || typeof data.request_type !== "string") {
    return { valid: false, error: "Tipo de solicitud inválido" };
  }
  if (!data.message || typeof data.message !== "string" || data.message.length > 2000) {
    return { valid: false, error: "Mensaje inválido" };
  }
  if (data.phone && data.phone.length > 40) {
    return { valid: false, error: "Teléfono demasiado largo" };
  }
  if (data.event && data.event.length > 160) {
    return { valid: false, error: "Evento demasiado largo" };
  }
  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData = await req.json();
    const data = requestData as PressRequest;

    const validation = validateInput(data);
    if (!validation.valid) {
      console.log("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending press request from:", escapeHtml(data.full_name), escapeHtml(data.email));

    const safe = {
      full_name: escapeHtml(data.full_name),
      outlet: escapeHtml(data.outlet),
      email: escapeHtml(data.email),
      phone: escapeHtml(data.phone || "No indicado"),
      request_type: escapeHtml(data.request_type),
      event: escapeHtml(data.event || "No indicado"),
      preferred_date: escapeHtml(data.preferred_date || "No indicada"),
      message: escapeHtml(data.message),
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Vacílate Esto Prensa <onboarding@resend.dev>",
        to: ["andreina.ascension@hacemosloquenosgusta.com"],
        subject: `Nueva solicitud de cobertura: ${safe.request_type} · ${safe.outlet}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e5; }
              .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; }
              .header h1 { color: white; font-size: 24px; margin: 0; font-weight: 800; }
              .content { padding: 30px; }
              .content p { color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 12px; }
              .content strong { color: #111; }
              .box { background: #f9f9f9; border-radius: 8px; padding: 16px; margin-top: 16px; }
              .footer { padding: 20px 30px; text-align: center; border-top: 1px solid #eee; }
              .footer p { color: #888; font-size: 12px; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Nueva solicitud de cobertura · Vacílate Esto</h1>
              </div>
              <div class="content">
                <p><strong>Nombre:</strong> ${safe.full_name}</p>
                <p><strong>Medio:</strong> ${safe.outlet}</p>
                <p><strong>Correo:</strong> ${safe.email}</p>
                <p><strong>Teléfono:</strong> ${safe.phone}</p>
                <p><strong>Tipo de solicitud:</strong> ${safe.request_type}</p>
                <p><strong>Evento / programa:</strong> ${safe.event}</p>
                <p><strong>Fecha tentativa:</strong> ${safe.preferred_date}</p>
                <div class="box">
                  <p><strong>Mensaje:</strong></p>
                  <p>${safe.message}</p>
                </div>
              </div>
              <div class="footer">
                <p>Enviado desde el formulario de cobertura de prensa en vacilateesto.com/prensa/cobertura</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-press-request function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
