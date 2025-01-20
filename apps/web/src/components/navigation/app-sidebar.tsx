"use client";

import { Logo } from "@/components/assets/logo";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import { useAuth } from "@/context/auth";
import { useWinery } from "@/context/winery";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import {
  ChevronRight,
  Grape,
  Home,
  LogOut,
  Settings,
  UserPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@/utils/shadcn";
import { useState } from "react";

// Menu items.
const dataTemplate = {
  brand: {
    name: "Tracecork",
    logo: Logo,
    by: "By Blazar Labs",
  },
  navMain: [
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
  ],
};
export function AppSidebar({ children }: { children: React.ReactNode }) {
  // * HOOKS
  const { user } = useAuth();
  const { winery } = useWinery();
  const router = useRouter();
  const pathname = usePathname();

  // * STATES
  const [data, setData] = useState<any>(dataTemplate);

  // * HANDLERS
  const handleSignOut = () => {
    signOut(auth);
    router.replace("/home");
  };

  const handleActiveSubItems = (selected: any) => {
    data.navMain.forEach((item: any) => {
      item.isActive = false;
      if (item.items) {
        item.items.forEach((subItem: any) => {
          subItem.isActive = false;
        });
      }
    });
    selected.isActive = true;
    setData({ ...data });
  };

  const handleActiveItems = (selected: any) => {
    if (selected.title === "Home") {
      data.navMain.forEach((item: any) => {
        item.isActive = false;
        if (item.items) {
          item.items.forEach((subItem: any) => {
            subItem.isActive = false;
          });
        }
      });
      selected.isActive = true;
      setData({ ...data });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg p-2 text-sidebar-primary-foreground">
              <Link href="/">
                <data.brand.logo />
              </Link>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item: any, i: number) => (
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
                          {item.title !== "Home" && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                      {/* )} */}
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem: any, j: number) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                                onClick={() => handleActiveSubItems(subItem)}
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
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-6" />
          </div>
          <div className="flex h-full w-full items-center justify-end gap-4 pr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/explore")}
            >
              Explore Wines
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
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
