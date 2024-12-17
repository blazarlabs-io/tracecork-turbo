import { createClient } from "@sanity/client";
import { countries } from "./data/countries";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2023-05-03", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN as string, // Needed for certain operations like updating content or accessing previewDrafts perspective
});

const systemVariablesId = "45befe2f-d33e-4973-b8bd-f3e2921cdb8a";

export default async function Page(): Promise<JSX.Element> {
  async function getSystemVariables() {
    const posts = await client.fetch('*[_type == "systemVariables"]');
    return posts;
  }

  async function getDocByType(type: string) {
    const posts = await client.fetch(`*[_type == "${type}"]`);
    return posts;
  }

  async function updateDocument(_id: string) {
    const docs = await getSystemVariables();
    console.log(docs[0].countries);
    const doc = {
      ...docs[0],
      countries: countries,
    };
    client.createOrReplace(doc).then((res) => {
      console.log(`Bike was created, document ID is ${res._id}`);
    });
  }

  console.log(await getDocByType("publicPages"));

  return (
    <>
      <span className="text-white">sandbox</span>
    </>
  );
}
