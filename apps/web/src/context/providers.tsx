"use client";

import { AuthProvider } from "./auth";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { WineryProvider } from "./winery";
import { ExplorerProvider } from "./explorer";
import { SystemVariablesProvider } from "./system-variables";
import { CmsProvider } from "./cms";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <CmsProvider>
        <ExplorerProvider>
          <SystemVariablesProvider>
            <AuthProvider>
              <WineryProvider>
                <APIProvider
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
                >
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
