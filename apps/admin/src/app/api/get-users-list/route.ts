import { initAdmin } from "../../../lib/firebase/admin";
import admin from "firebase-admin";

export async function GET() {
  await initAdmin();
  const users = await admin.auth().listUsers();
  console.log(users);
  return new Response("Hello, Next.js!");
}
