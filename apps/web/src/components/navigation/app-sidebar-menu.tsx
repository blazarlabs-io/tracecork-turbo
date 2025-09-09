"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/ui/sidebar";

import { useTranslationHandler } from "@/hooks/use-translation-handler";
import { useTranslateSidebarMenu } from "@/hooks/use-translate-sidebar-menu";
import type { MenuType, MenuItemType } from "@/types/sidebar";
import { useResponsiveSize } from "@/hooks/use-responsive-size";

// --- URLs STABILE pentru ordinea finală
const MENU_URLS = {
  home: "/dashboard/home",
  winery: "/dashboard/winery-details",       // afișăm label-ul părintelui (My Winery)
  wines: "/dashboard/my-wines",
  subscription: "/dashboard/subscription",
  manage: "/dashboard/manage-account",
  settings: "/dashboard/general-settings",   // afișăm label-ul părintelui (Settings)
};

// Caută în "data" după URL și întoarce itemul + părintele (dacă e subitem)
function findByUrlWithParent(
  data: MenuType[],
  targetUrl: string
): { item: MenuItemType | MenuType; parent?: MenuType; icon?: any } | null {
  for (const group of data) {
    // 1) potrivire directă pe grup (rare la noi — Home)
    if (group.url === targetUrl) {
      return { item: group, icon: group.icon };
    }
    // 2) potrivire în subitems
    if (group.items?.length) {
      const sub = group.items.find((s) => s.url === targetUrl);
      if (sub) {
        return { item: sub, parent: group, icon: group.icon };
      }
    }
  }
  return null;
}

type FlatItem = {
  label: string;   // tradus din Sanity
  url: string;
  icon?: any;
};

export function AppSidebarMenu() {
  const { t } = useTranslationHandler();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { device } = useResponsiveSize();

  const { data } = useTranslateSidebarMenu() as { data: MenuType[] };

  // Construim lista plată strict prin URL (independent de limbă)
  const flatItems: FlatItem[] = React.useMemo(() => {
    const order = [
      { url: MENU_URLS.home, labelFromParent: false },
      { url: MENU_URLS.winery, labelFromParent: true },  // My Winery
      { url: MENU_URLS.wines, labelFromParent: false },  // My Wines
      { url: MENU_URLS.subscription, labelFromParent: false },
      { url: MENU_URLS.manage, labelFromParent: false },
      { url: MENU_URLS.settings, labelFromParent: true }, // Settings
    ];

    const list: FlatItem[] = [];

    for (const cfg of order) {
      const found = findByUrlWithParent(data, cfg.url);
      if (!found) continue; // dacă structura nu e încărcată, îl sărim (evită crash)

      const label = cfg.labelFromParent
        ? found.parent?.title ?? (found.item as MenuItemType).title
        : (found.item as MenuItemType).title ?? (found.item as MenuType).title;

      list.push({
        label,
        url: cfg.url,
        icon: found.icon, // folosim icon-ul grupului pentru consistență vizuală
      });
    }

    return list;
  }, [data]);

  // activ dacă ruta e exactă sau sub-rută (ex: /dashboard/general-settings/advanced)
  const isActiveUrl = React.useCallback(
    (url: string) => pathname === url || pathname.startsWith((url.endsWith("/") ? url : url + "/")),
    [pathname]
  );

  const handleAfterClick = () => {
    if (device === "mobile") toggleSidebar();
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("dashboardGlobalComponents.sideBar.title")}</SidebarGroupLabel>
      <SidebarMenu>
        {flatItems.map((it) => (
          <SidebarMenuItem key={it.url}>
            <SidebarMenuButton asChild isActive={isActiveUrl(it.url)} onClick={handleAfterClick}>
              <Link href={it.url}>
                <div className="flex h-8 items-center gap-2 text-sm">
                  {it.icon && <it.icon className="h-4 w-4" />}
                  <span>{it.label}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}