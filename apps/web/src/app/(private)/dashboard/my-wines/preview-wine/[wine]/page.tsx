import { WinePreviewPage } from "@/components/pages/wine-preview-page";

type Params = Promise<{ wine: string }>;

export default async function PreviewWinePage(props: { params: Params }) {
  const params = await props.params;
  const wine = params.wine;
  return <WinePreviewPage wineId={wine} />;
}
