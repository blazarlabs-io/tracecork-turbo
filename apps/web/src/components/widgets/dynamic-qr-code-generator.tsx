import { base64ToFile, getQrCodeImageData } from "@/utils/qr-code";
import { useCallback, useEffect, useRef } from "react";
import { QRCode } from "react-qrcode-logo";

export interface DynamicQrCodeGeneratorProps {
  wineId: string;
  onGenerated: (file: File, base64: string) => void;
}

export const DynamicQrCodeGenerator = ({
  wineId,
  onGenerated,
}: DynamicQrCodeGeneratorProps) => {
  const mountRef = useRef<boolean>(false);

  const handleOnGenerated = useCallback(
    (file: File, base64: string) => {
      onGenerated(file as File, base64 as string);
    },
    [onGenerated],
  );

  useEffect(() => {
    if (!mountRef.current && wineId) {
      mountRef.current = true;
      const base64String = getQrCodeImageData("react-qrcode-logo");
      const file = base64ToFile(base64String, "qr-code.png");
      handleOnGenerated(file, base64String);
    }
  }, [wineId]);

  return (
    <div className="hidden">
      <QRCode
        value={`${
          process.env.NEXT_PUBLIC_DYNAMIC_QR_CODES_STATIC_URL as string
        }${wineId}`}
        size={1500}
        qrStyle="squares"
        eyeRadius={4}
        id="react-qrcode-logo"
      />
    </div>
  );
};
