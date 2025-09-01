import { useSystemVariables } from "@/context/system-variables";
import { useWinery } from "@/context/winery";
import { useEffect, useState } from "react";

export const useQRCodesLimit = () => {
  const { pricing } = useSystemVariables();
  const { winery, qrCodes } = useWinery();
  const [qrCodesLimit, setQrCodesLimit] = useState<number | "Unlimited">(0);
  const [qrCodesLeft, setQrCodesLeft] = useState<number | "Unlimited">(0);
  const [planPrice, setPlanPrice] = useState<number>(0);
  const [planName, setPlanName] = useState<string>("");

  useEffect(() => {
    if (winery && pricing && qrCodes) {
      const _pricing = pricing.find((p) => p.name === winery.billing?.level);
      if (_pricing) {
        console.log("pricing", _pricing);
        console.log("qrCodes", qrCodes);
        console.log("qrCodes.length", qrCodes.length);
        setPlanName(_pricing.name);
        setPlanPrice(_pricing.price);
        setQrCodesLimit(
          _pricing.name === "platinum"
            ? "Unlimited"
            : (_pricing.qrCodes as number) - qrCodes.length,
        );
        setQrCodesLeft(
          _pricing.name === "platinum"
            ? "Unlimited"
            : (_pricing.qrCodes as number) - qrCodes.length,
        );
      }
    }
  }, [winery, pricing, qrCodes]);

  return { qrCodesLimit, qrCodesLeft, planPrice, planName };
};
