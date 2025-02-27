import { DynamicWineDetailsPage } from "~/src/features/wineries/pages/wines/dynamic-wine-details-page";

type Params = Promise<{ id: string }>;

export default async function WineDetails(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  return <>{id && <DynamicWineDetailsPage wineId={id} />}</>;
}
