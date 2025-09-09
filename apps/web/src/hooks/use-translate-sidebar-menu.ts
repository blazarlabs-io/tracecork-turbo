import { ChevronRight, Grape, Home, Settings, UserPen } from "lucide-react";
import { useTranslationHandler } from "./use-translation-handler";
import { useEffect, useState } from "react";
import { MenuType } from "../types/sidebar";

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

export const useTranslateSidebarMenu = () => {
  const { t } = useTranslationHandler();
  const setMenuTraslation = (data: MenuType[]) => {
    return data.map((d, i) => {
      d.title = t(`dashboardGlobalComponents.sideBar.items.${i}.label`);
      if (d.items) {
        d.items = d.items.map((item, j) => {
          return {
            ...item,
            title: t(
              `dashboardGlobalComponents.sideBar.items.${i}.subItems.${j}.label`,
            ),
          };
        });
      }
      return d;
    });
  };
  const [data, setData] = useState<MenuType[]>(setMenuTraslation(dataTemplate));

    // Re-traducere când se schimbă limba + păstrăm item-ul activ după URL
  useEffect(() => {
    setData((prev) => {
      // 1) Colectăm URL-urile active din starea curentă
      const activeUrls = new Set<string>();
      prev.forEach((g) => {
        if (g.items?.length) {
          g.items.forEach((s) => s.isActive && activeUrls.add(s.url));
        } else if (g.isActive) {
          activeUrls.add(g.url);
        }
      });

      // 2) Refacem meniul tradus din template
      const next = setMenuTraslation(dataTemplate);

      // 3) Reaplicăm active pe baza URL-ului (stabil, independent de limbă)
      return next.map((g) => {
        if (g.items?.length) {
          const items = g.items.map((s) => ({ ...s, isActive: activeUrls.has(s.url) }));
          return { ...g, items, isActive: items.some((s) => s.isActive) };
        }
        return { ...g, isActive: activeUrls.has(g.url) };
      });
    });
  }, [t]); // dacă ai și locale în hook-ul tău, pune-l și pe el aici


  return { data, setData };
};
