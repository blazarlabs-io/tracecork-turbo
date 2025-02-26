import { ConfirmEmailPage } from "@/features/authentication/pages/confirm-email";
import { ConfirmEmailParamsType } from "~/src/features/authentication/types";

type Params = Promise<{ mode: string }>;
type SearchParams = Promise<ConfirmEmailParamsType>;

export default async function ConfirmEmail(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return <ConfirmEmailPage {...searchParams} />;
}
