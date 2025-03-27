import { useEffect, useState } from "react";
import { useTokenizer } from "~/src/context/tokenizer";
import { TokenizedWineDialog } from "../../dialogs/tokenized-wine-dialog";
import { TokenizingLoader } from "./tokenizing-loder";
import { TokenizedWineUpdateDialog } from "../../dialogs/tokenized-wine-update-dialog";
import { TokenizedWineBurnDialog } from "../../dialogs/tokenized-wine-burn-dialog";

export const Tokenizer = () => {
  const { tokenizing, batch, action } = useTokenizer();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(tokenizing);
  }, [tokenizing]);
  return (
    <>
      {loading ? (
        <TokenizingLoader />
      ) : action === "create" ? (
        <TokenizedWineDialog />
      ) : action === "update" ? (
        <TokenizedWineUpdateDialog />
      ) : action === "burn" ? (
        <TokenizedWineBurnDialog />
      ) : (
        <></>
      )}
    </>
  );
};
