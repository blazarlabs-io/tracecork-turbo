import { WineStepper } from "@/components/widgets/wine-stepper";

type Params = Promise<{ wine: string; step: string }>;
type SearchParams = Promise<{ step: "editor" | "preview" | "publish" }>;

export default async function Wine(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const wine = params.wine;
  const step = searchParams.step;
  return <WineStepper wineId={wine} selectedStep={step} />;
}
