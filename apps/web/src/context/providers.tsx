"use client";

import { AuthProvider } from "./auth";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { WineryProvider } from "./winery";
import { ExplorerProvider } from "./explorer";
import { SystemVariablesProvider } from "./system-variables";
import { CmsProvider } from "./cms";
import { urlDomailHandler } from "../hooks/url-domain-handler";
import { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } from "../utils/envConstants";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  urlDomailHandler();

  return (
    <>
      <Toaster />
      <CmsProvider>
        <ExplorerProvider>
          <SystemVariablesProvider>
            <AuthProvider>
              <WineryProvider>
                <APIProvider apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  {children}
                </APIProvider>
              </WineryProvider>
            </AuthProvider>
          </SystemVariablesProvider>
        </ExplorerProvider>
      </CmsProvider>
    </>
  );
};
