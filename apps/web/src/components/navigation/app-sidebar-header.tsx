"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Separator } from "@repo/ui/components/ui/separator";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { useAuth } from "@/context/auth";
import { useWinery } from "@/context/winery";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { LocaleSwitcher } from "../widgets/locale-switcher/locale-switcher";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export function AppSidebarHeader() {
  // * HOOKS
  const { t } = useTranslationHandler();
  const { user } = useAuth();
  const { winery } = useWinery();
  const router = useRouter();

  // * HANDLERS
  const handleSignOut = () => {
    signOut(auth);
    router.replace("/home");
  };

  return (
    <header className="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-6" />
      </div>
      <div className="flex h-full w-full items-center justify-end gap-4 pr-4">
        <LocaleSwitcher />
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/explore")}
        >
          {t("dashboardGlobalComponents.topBar.buttons.exploreWines.label")}
        </Button>
        <Separator orientation="vertical" className="h-6" />
        {user && winery && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border">
                <AvatarImage src={winery?.info?.avatar as string} />
                <AvatarFallback className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-[#86F096] text-primary-foreground">
                  {user.displayName?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut />
                  {t("dashboardGlobalComponents.topBar.dropdown.0.label")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
