import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const sendInvoiceEmailInputSchema = z.object({
  resendApiKey: z.string().optional(),
  fromEmail: z.string(),
  toEmail: z.string(),
  customerName: z.string(),
  invoiceNumber: z.string(),
  total: z.number(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).optional(),
  companyDetails: z.object({
    name: z.string(),
    gstin: z.string(),
    address: z.string(),
    phone: z.string(),
  }).optional(),
});

const isPublicEmailDomain = (email: string): boolean => {
  const publicDomains = [
    "gmail.com", "yahoo.com", "yahoo.co.in", "outlook.com", "hotmail.com", 
    "aol.com", "icloud.com", "protonmail.com", "zoho.com", "yandex.com", 
    "mail.com", "gmx.com"
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  return publicDomains.includes(domain);
};

export const sendInvoiceEmailDirectServer = createServerFn({ method: "POST" })
  .validator(sendInvoiceEmailInputSchema)
  .handler(async ({ data }) => {
    const {
      resendApiKey,
      fromEmail,
      toEmail,
      customerName,
      invoiceNumber,
      total,
      items = [],
      companyDetails = {
        name: "INVENTROX Specialty Roasters",
        gstin: "07AAACO8892F1Z9",
        address: "Plot 45, Udyog Vihar Phase 4, Gurgaon, Haryana, 122016",
        phone: "+91 98765 43210",
      },
    } = data;

    // Fallback to server-side environment variables if not provided in request
    const apiKey = resendApiKey || process.env.RESEND_API_KEY || "";
    if (!apiKey) {
      throw new Error("Resend API Key is not configured. Please add it to your Settings or the .env file.");
    }

    // Use default sender address from Resend sandbox if custom sender domain isn't verified yet
    // Public domains like @gmail.com must always use onboarding@resend.dev as Resend forbids sending from public domains.
    let verifiedFromEmail = fromEmail.includes("@") && 
                            !fromEmail.includes("example.com") && 
                            !fromEmail.includes("your-gmail") &&
                            !isPublicEmailDomain(fromEmail)
      ? fromEmail
      : "onboarding@resend.dev";

    let senderBranding = `INVENTROX <${verifiedFromEmail}>`;

    // Premium HTML layout for email invoice
    const itemsHtml = items.length > 0 
      ? items.map(item => `
        <tr style="border-bottom: 1px solid #edf2f7;">
          <td style="padding: 12px 0; color: #2d3748; font-size: 14px;">${item.name}</td>
          <td style="padding: 12px 0; color: #718096; font-size: 14px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 0; color: #2d3748; font-size: 14px; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
          <td style="padding: 12px 0; color: #2d3748; font-size: 14px; text-align: right; font-weight: 600;">₹${(item.quantity * item.price).toLocaleString("en-IN")}</td>
        </tr>
      `).join("")
      : `
        <tr style="border-bottom: 1px solid #edf2f7;">
          <td style="padding: 12px 0; color: #2d3748; font-size: 14px;">Specialty Roasted Beans (Blend order)</td>
          <td style="padding: 12px 0; color: #718096; font-size: 14px; text-align: center;">1</td>
          <td style="padding: 12px 0; color: #2d3748; font-size: 14px; text-align: right;">₹${total.toLocaleString("en-IN")}</td>
          <td style="padding: 12px 0; color: #2d3748; font-size: 14px; text-align: right; font-weight: 600;">₹${total.toLocaleString("en-IN")}</td>
        </tr>
      `;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                
                <!-- HEADER BAND -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); padding: 35px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 0.05em; font-family: 'Outfit', sans-serif;">INVENTROX</h1>
                    <p style="margin: 6px 0 0 0; color: #c084fc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em;">Specialty Roasters OS</p>
                  </td>
                </tr>

                <!-- INVOICE OVERVIEW -->
                <tr>
                  <td style="padding: 35px 35px 20px 35px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #718096; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">Invoice To</p>
                          <h2 style="margin: 5px 0 0 0; color: #1a202c; font-size: 18px; font-weight: 700;">${customerName}</h2>
                          <p style="margin: 2px 0 0 0; color: #4a5568; font-size: 13px;">Recipient Inbox</p>
                        </td>
                        <td style="text-align: right; vertical-align: top;">
                          <div style="display: inline-block; background-color: #f3e8ff; border-radius: 8px; padding: 4px 10px;">
                            <span style="color: #6b21a8; font-size: 12px; font-weight: 700; letter-spacing: 0.05em;">#${invoiceNumber}</span>
                          </div>
                          <p style="margin: 6px 0 0 0; color: #718096; font-size: 12px;">Date: ${new Date().toLocaleDateString("en-IN")}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- DIVIDER -->
                <tr>
                  <td style="padding: 0 35px;">
                    <div style="border-bottom: 1px dashed #e2e8f0; height: 1px; line-height: 1px;"></div>
                  </td>
                </tr>

                <!-- ITEMS TABLE -->
                <tr>
                  <td style="padding: 20px 35px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <thead>
                        <tr style="border-bottom: 2px solid #edf2f7;">
                          <th align="left" style="padding-bottom: 10px; color: #4a5568; font-size: 12px; font-weight: 700; text-transform: uppercase;">Description</th>
                          <th align="center" style="padding-bottom: 10px; color: #4a5568; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 60px;">Qty</th>
                          <th align="right" style="padding-bottom: 10px; color: #4a5568; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 80px;">Rate</th>
                          <th align="right" style="padding-bottom: 10px; color: #4a5568; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 100px;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- TOTALS SECTION -->
                <tr>
                  <td style="padding: 10px 35px 35px 35px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%"></td>
                        <td width="50%">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border-radius: 16px; padding: 20px; border: 1px solid #f3e8ff;">
                            <tr>
                              <td style="color: #718096; font-size: 13px; padding-bottom: 10px;">Total Due:</td>
                              <td style="color: #6b21a8; font-size: 20px; font-weight: 800; text-align: right; padding-bottom: 10px;">₹${total.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr style="border-top: 1px solid #e2e8f0;">
                              <td style="color: #a0aec0; font-size: 11px; padding-top: 10px;" colspan="2">Status: <b>PAID ONLINE</b></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- BUSINESS DETAILS -->
                <tr>
                  <td style="background-color: #fafbfc; border-top: 1px solid #edf2f7; padding: 35px; border-radius: 0 0 24px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: top; width: 70%;">
                          <h4 style="margin: 0; color: #2d3748; font-size: 14px; font-weight: 700;">${companyDetails.name}</h4>
                          <p style="margin: 4px 0 0 0; color: #718096; font-size: 12px; line-height: 1.5;">${companyDetails.address}</p>
                          <p style="margin: 8px 0 0 0; color: #718096; font-size: 12px;">GSTIN: <span style="font-family: monospace; font-weight: 600; color: #4a5568;">${companyDetails.gstin}</span></p>
                          <p style="margin: 2px 0 0 0; color: #718096; font-size: 12px;">Contact: <span style="color: #4a5568; font-weight: 600;">${companyDetails.phone}</span></p>
                        </td>
                        <td style="text-align: right; vertical-align: bottom; width: 30%;">
                          <!-- Watermark Seal Simulation -->
                          <div style="display: inline-block; border: 2px double #a855f7; border-radius: 50%; width: 70px; height: 70px; text-align: center; vertical-align: middle; box-sizing: border-box; padding-top: 14px; background-color: rgba(168, 85, 247, 0.03);">
                            <span style="color: #a855f7; font-size: 9px; font-weight: 700; text-transform: uppercase; display: block; line-height: 1.2;">OFFICIAL</span>
                            <span style="color: #a855f7; font-size: 7px; font-weight: 600; display: block; line-height: 1.2; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 0 4px;">${companyDetails.name.split(" ")[0]}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    const sendEmail = async (from: string, to: string) => {
      return await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Your ${companyDetails.name} Invoice #${invoiceNumber}`,
          html: htmlContent,
        }),
      });
    };

    try {
      console.log(`Sending email via Resend to ${toEmail} from ${verifiedFromEmail}...`);
      let response = await sendEmail(senderBranding, toEmail);
      let resBody = await response.json();

      // Auto-heal unverified 'from' email domain
      if (!response.ok && (
        response.status === 403 || 
        response.status === 400 || 
        (resBody?.message && (
          resBody.message.toLowerCase().includes("domain") || 
          resBody.message.toLowerCase().includes("verify") || 
          resBody.message.toLowerCase().includes("unverified") ||
          resBody.message.toLowerCase().includes("from")
        ))
      ) && verifiedFromEmail !== "onboarding@resend.dev") {
        console.log(`[Resend Auto-Heal] Original sender ${verifiedFromEmail} failed. Retrying with onboarding@resend.dev...`);
        verifiedFromEmail = "onboarding@resend.dev";
        senderBranding = `INVENTROX <onboarding@resend.dev>`;
        response = await sendEmail(senderBranding, toEmail);
        resBody = await response.json();
      }

      if (!response.ok) {
        const errorMsg = resBody?.message || "";
        // Auto-heal Resend Sandbox 403 validation error (when recipient isn't verified on Sandbox)
        if (response.status === 403 && (errorMsg.includes("testing emails") || errorMsg.includes("own email address"))) {
          const emailMatch = errorMsg.match(/own email address \(([^)]+)\)/i);
          const verifiedEmail = emailMatch ? emailMatch[1] : null;

          if (verifiedEmail && verifiedEmail !== toEmail) {
            console.log(`[Resend Sandbox] Redirecting email to verified tester address: ${verifiedEmail} (original recipient was: ${toEmail})`);
            
            // Re-render HTML with redirection footnote
            const redirectedHtmlContent = htmlContent.replace(
              "Recipient Inbox",
              `Recipient Inbox (Redirected to verified tester: ${verifiedEmail} from original customer email: ${toEmail})`
            );

            // Ensure sender is onboarding@resend.dev to prevent double failure if verifiedFromEmail is still unverified
            const finalSender = verifiedFromEmail === "onboarding@resend.dev" 
              ? senderBranding 
              : `INVENTROX <onboarding@resend.dev>`;

            const retryResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: finalSender,
                to: [verifiedEmail],
                subject: `[Sandbox Redirect] Your ${companyDetails.name} Invoice #${invoiceNumber}`,
                html: redirectedHtmlContent,
              }),
            });

            const retryBody = await retryResponse.json();
            if (retryResponse.ok) {
              console.log(`[Resend Sandbox] Email successfully redirected and dispatched to ${verifiedEmail}`);
              return {
                success: true,
                id: retryBody.id,
                sandboxRedirected: true,
                verifiedEmail,
              };
            } else {
              throw new Error(retryBody?.message || `Redirect failed with status ${retryResponse.status}`);
            }
          }
        }
        throw new Error(errorMsg || `Resend responded with HTTP status ${response.status}`);
      }

      console.log(`Email dispatched successfully! Resend Response ID: ${resBody.id}`);
      return {
        success: true,
        id: resBody.id,
        sandboxRedirected: false,
      };

    } catch (error: any) {
      console.error("Resend API transmission error:", error);
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  });

export const checkEmailConfigStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    return {
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeySource: process.env.RESEND_API_KEY ? "Server (.env)" : "None",
    };
  });
