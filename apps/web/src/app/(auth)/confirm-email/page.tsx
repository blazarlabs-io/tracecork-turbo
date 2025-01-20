import { ConfirmEmailPage } from "@/components/pages/confirm-email-page";

type Params = Promise<{ mode: string }>;
type SearchParams = Promise<{
  mode: string;
  continueUrl: string;
  lang: string;
  oobCode: string;
}>;

export default async function ConfirmEmail(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return <ConfirmEmailPage code={searchParams.oobCode} />;
}
