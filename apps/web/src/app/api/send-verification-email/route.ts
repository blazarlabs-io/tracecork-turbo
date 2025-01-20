import { initAdmin } from "@/lib/firebase/admin";
import * as sgMail from "@sendgrid/mail";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: Request) {
  await initAdmin();

  const data = await request.json();

  sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_REDIRECT_URL as string,
    // This must be true for email link sign-in.
    handleCodeInApp: true,
  };

  const url = await getAuth().generateEmailVerificationLink(
    data.email as string,
    actionCodeSettings,
  );

  console.log("URL", url);

  const msg: any = {
    to: data.email,
    from: process.env.NEXT_PUBLIC_TRACECORK_EMAIL as string, // Use the email address or domain you verified above
    templateId: "d-a4ac8306b7b54068a466f749ffdc5ed2",
    personalizations: [
      {
        to: [{ email: data.email }],
        dynamic_template_data: {
          verificationUrl: url,
        },
      },
    ],
  };

  const res = await sgMail.send(msg);

  return Response.json({
    success: true,
  });
}
