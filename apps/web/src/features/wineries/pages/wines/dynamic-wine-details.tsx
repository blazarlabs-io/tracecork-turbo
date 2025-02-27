"use client";

import { useDynamicDomainHandler } from "~/src/features/wineries/hooks/qr-code-domain/use-dynamic-domain-handler";

export interface WineDetailsPageProps {
  wineId: string;
}

export const DynamicWineDetailsPage = ({ wineId }: WineDetailsPageProps) => {
  useDynamicDomainHandler(wineId);

  return <h1>Loading...</h1>;
};
