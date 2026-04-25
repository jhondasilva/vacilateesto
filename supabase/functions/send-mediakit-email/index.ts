import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendMediaKitRequest {
  email: string;
  pdfBase64: string;
  kit?: "esto" | "mundial";
}

// HTML escape function to prevent XSS/injection attacks
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

// Input validation function
function validateInput(data: SendMediaKitRequest): { valid: boolean; error?: string } {
  // Check required fields
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: "Email is required and must be a string" };
  }
  if (!data.pdfBase64 || typeof data.pdfBase64 !== 'string') {
    return { valid: false, error: "PDF data is required" };
  }

  // Validate email length
  if (data.email.length > 255) {
    return { valid: false, error: "Email must be less than 255 characters" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Validate PDF size (max 25MB base64 - Resend allows up to 40MB)
  if (data.pdfBase64.length > 35000000) {
    return { valid: false, error: "PDF file is too large" };
  }

  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-mediakit-email function called");
  
  // Handle CORS preflight requests
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
    const { email, pdfBase64, kit = "esto" } = requestData as SendMediaKitRequest;

    const isMundial = kit === "mundial";
    const subject = isMundial
      ? "Media Kit Vacílate El Mundial 2026"
      : "Media Kit Vacílate Esto 2026";
    const filename = isMundial
      ? "Media Kit Vacilate El Mundial 2026.pdf"
      : "Media Kit Vacilate Esto 2026.pdf";
    const headerTitle = isMundial ? "VACÍLATE EL MUNDIAL" : "VACÍLATE ESTO";
    const headerSub = isMundial ? "Media Kit Mundial 2026" : "Media Kit 2026";
    
    console.log(`Received request for email: ${email}`);
    console.log(`PDF base64 length: ${pdfBase64?.length || 0}`);

    // Validate input
    const validation = validateInput({ email, pdfBase64 });
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

    console.log(`Sending Media Kit PDF to: ${escapeHtml(email)}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Vacílate Esto <onboarding@resend.dev>",
        to: [email],
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #141414; border-radius: 16px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 30px; text-align: center; }
              .header h1 { color: white; font-size: 28px; margin: 0; font-weight: 800; }
              .header p { color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 10px; }
              .content { padding: 40px 30px; text-align: center; }
              .content h2 { color: white; font-size: 22px; margin-bottom: 20px; }
              .content p { color: #a1a1a1; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
              .footer { padding: 30px; text-align: center; border-top: 1px solid #333; }
              .footer p { color: #666; font-size: 12px; margin: 0; }
              .footer a { color: #ef4444; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${escapeHtml(headerTitle)}</h1>
                <p>${escapeHtml(headerSub)}</p>
              </div>
              <div class="content">
                <h2>¡Gracias por tu interés!</h2>
                <p>Adjunto encontrarás nuestro Media Kit con toda la información sobre el ecosistema de contenido más grande de Venezuela.</p>
                <p>¿Listo para conectar con nuestra audiencia? Contáctanos para crear una estrategia personalizada.</p>
              </div>
              <div class="footer">
                <p>
                  <a href="mailto:elpatio@hacemosloquenosgusta.com">elpatio@hacemosloquenosgusta.com</a><br><br>
                  © 2026 Vacílate Esto - Todos los derechos reservados
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename,
            content: pdfBase64,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-mediakit-email function:", error);
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
