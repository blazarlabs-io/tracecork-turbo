import { initAdmin } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";
import {
  NEXT_PUBLIC_SENDGRID_API_KEY,
  NEXT_PUBLIC_TRACECORK_EMAIL,
} from "@/utils/envConstants";

export async function POST(request: Request) {
  await initAdmin();

  sgMail.setApiKey(NEXT_PUBLIC_SENDGRID_API_KEY);

  const data = await request.json();

  const msg: any = {
    to: data.email,
    from: NEXT_PUBLIC_TRACECORK_EMAIL, // Use the email address or domain you verified above
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
