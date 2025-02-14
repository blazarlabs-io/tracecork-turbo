import { initAdmin } from "@/lib/firebase/admin";
import * as sgMail from "@sendgrid/mail";
import { ActionCodeSettings, getAuth } from "firebase-admin/auth";
import { emailTemplates } from "@/utils/email-templates";
import {
  NEXT_PUBLIC_EMAIL_VERIFICATION_REDIRECT_URL,
  NEXT_PUBLIC_SENDGRID_API_KEY,
  NEXT_PUBLIC_TRACECORK_EMAIL,
} from "@/utils/envConstants";

export async function POST(request: Request) {
  await initAdmin();

  const data = await request.json();

  sgMail.setApiKey(NEXT_PUBLIC_SENDGRID_API_KEY as string);

  const baseUrl =
    NEXT_PUBLIC_EMAIL_VERIFICATION_REDIRECT_URL + "/confirm-email";

  const actionCodeSettings: ActionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: baseUrl,
    // This must be true for email link sign-in.
    handleCodeInApp: true,
  };

  const url = await getAuth().generateEmailVerificationLink(
    data.email as string,
    actionCodeSettings,
  );

  const params = url.split("?")[1];
  const verificationUrl = `${baseUrl}?${params}`;

  const msg: sgMail.MailDataRequired = {
    to: data.email,
    from: NEXT_PUBLIC_TRACECORK_EMAIL, // Use the email address or domain you verified above
    templateId: emailTemplates["confirmation-email"],
    personalizations: [
      {
        to: [{ email: data.email }],
        dynamicTemplateData: {
          verificationUrl,
        },
      },
    ],
  };

  await sgMail.send(msg);

  return Response.json({
    success: true,
  });
}
