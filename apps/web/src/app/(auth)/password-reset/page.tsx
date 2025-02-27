import { PasswordResetPage } from "~/src/features/authentication/pages/password-reset-page";
import { ConfirmEmailParamsType } from "~/src/features/authentication/types";

type Params = Promise<{ mode: string }>;
type SearchParams = Promise<ConfirmEmailParamsType>;

export default async function PasswordResetSent(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return <PasswordResetPage {...searchParams} />;
}
