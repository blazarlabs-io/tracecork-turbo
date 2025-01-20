import { initAdmin } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

export async function POST(request: Request) {
  await initAdmin();

  sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY as string);

  const data = await request.json();

  const msg: any = {
    to: data.email,
    from: process.env.NEXT_PUBLIC_TRACECORK_EMAIL as string, // Use the email address or domain you verified above
    templateId: data.templateId,
    personalizations: [
      {
        to: [{ email: data.email }],
        dynamic_template_data: {
          user: data.email,
        },
      },
    ],
  };

  admin
    .auth()
    .updateUser(data.uid, {
      email: data.email,
      disabled: true,
    })
    .then(async () => {
      await sgMail.send(msg);
    });

  return Response.json({
    success: true,
  });
}
