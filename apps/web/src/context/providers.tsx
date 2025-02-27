"use client";

import { AuthProvider } from "@/features/authentication";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { WineryProvider } from "../features/wineries/context/winery-provider";
import { ExplorerProvider } from "./explorer";
import { SystemVariablesProvider } from "./system-variables";
import { CmsProvider } from "./cms";
import { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } from "../utils/envConstants";
import { LocaleProvider } from "./LanguageProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <CmsProvider>
        <ExplorerProvider>
          <SystemVariablesProvider>
            <AuthProvider>
              <WineryProvider>
                <APIProvider apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <LocaleProvider>{children}</LocaleProvider>
                </APIProvider>
              </WineryProvider>
            </AuthProvider>
          </SystemVariablesProvider>
        </ExplorerProvider>
      </CmsProvider>
    </>
  );
};
