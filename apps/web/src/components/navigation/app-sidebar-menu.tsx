"use client";

import { Logo } from "@/components/assets/logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@repo/ui/components/ui/sidebar";
import { ChevronRight, Grape, Home, Settings, UserPen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAppSidebarHeaderTranslations } from "~/src/hooks/private-routes-layout/use-app-sidebar-header-translations";

type MenuItemType = {
  title: string;
  url: string;
  isActive: boolean;
};

type MenuType = {
  title: string;
  url: string;
  icon: any;
  items: MenuItemType[] | null;
  isActive: boolean;
};
// Menu items.
const dataTemplate: MenuType[] = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
    items: null,
    isActive: true,
  },
  {
    title: "My Winery",
    url: "#",
    icon: Grape,
    isActive: false,
    items: [
      {
        title: "Winery Details",
        url: "/dashboard/winery-details",
        isActive: false,
      },
      {
        title: "My Wines",
        url: "/dashboard/my-wines",
        isActive: false,
      },
    ],
  },
  {
    title: "My Account",
    url: "#",
    icon: UserPen,
    isActive: false,
    items: [
      {
        title: "Subscription",
        url: "/dashboard/subscription",
        isActive: false,
      },
      {
        title: "Manage Account",
        url: "/dashboard/manage-account",
        isActive: false,
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    isActive: false,
    items: [
      {
        title: "General Settings",
        url: "/dashboard/general-settings",
        isActive: false,
      },
    ],
  },
];
export function AppSidebarMenu() {
  // * HOOKS
  const { t } = useAppSidebarHeaderTranslations();

  // * STATES
  const [data, setData] = useState<MenuType[]>(dataTemplate);

  const handleActiveSubItems = (tittle: string, selected: MenuItemType) => {
    setData((old) => {
      return old.map((o) => {
        if (o.title === tittle) {
          return {
            ...o,
            isActive: true,
            items: o.items
              ? o.items.map((it) => ({
                  ...it,
                  isActive: it.title === selected.title,
                }))
              : null,
          };
        }
        return {
          ...o,
          isActive: false,
          items: o.items
            ? o.items.map((it) => ({ ...it, isActive: false }))
            : null,
        };
      });
    });
  };

  const handleActiveItems = (selected: any) => {
    if (selected.title === "Home") {
      setData((old) => {
        return old.map((o) => {
          if (o.title === "Home") {
            return {
              ...o,
              isActive: true,
            };
          }
          return {
            ...o,
            isActive: false,
            items: o.items
              ? o.items.map((it) => ({ ...it, isActive: false }))
              : null,
          };
        });
      });
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {t("dashboardGlobalComponents.sideBar.title")}
      </SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  onClick={() => handleActiveItems(item)}
                >
                  <Link href={item.url as string | ""}>
                    <div className="flex h-8 items-center gap-2 text-sm">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </div>
                    {!!item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </Link>
                </SidebarMenuButton>
                {/* )} */}
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                          onClick={() =>
                            handleActiveSubItems(item.title, subItem)
                          }
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
