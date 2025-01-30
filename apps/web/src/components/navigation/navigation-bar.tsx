"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { Logo } from "../assets/logo";
import { useAuth } from "@/context/auth";
import { Separator } from "@repo/ui/components/ui/separator";
import { LocaleSwitcher } from "@/components/widgets/locale-switcher/locale-switcher";
import { useTranslationHandler } from "@/hooks/useTranslationHandler";

export const NavigationBar = () => {
  const { t } = useTranslationHandler();
  const { user } = useAuth();

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="xl:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle></SheetTitle>
          <Link href="/home" className="mr-6 hidden xl:flex" prefetch={false}>
            <Logo className="" />
          </Link>
          <div className="grid gap-2 py-6">
            <Link
              href="/home"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              {t("topBar.links.home.label")}
            </Link>
            <Link
              href="/explore"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              {t("topBar.links.explore.label")}
            </Link>
            <Link
              href="/pricing"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              {t("topBar.links.pricing.label")}
            </Link>
            <Link
              href="/contact"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              {t("topBar.links.contact.label")}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/home" className="mr-6 hidden xl:flex" prefetch={false}>
            <Logo className="" />
          </Link>
          <Separator
            orientation="vertical"
            className="hidden h-6 w-[1.5px] xl:flex"
          />
          <nav className="hidden gap-6 xl:flex">
            <Link
              href="/home"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              prefetch={false}
            >
              {t("topBar.links.home.label")}
            </Link>
            <Link
              href="/explore"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              prefetch={false}
            >
              {t("topBar.links.explore.label")}
            </Link>
            <Link
              href="/pricing"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              prefetch={false}
            >
              {t("topBar.links.pricing.label")}
            </Link>
            <Link
              href="/contact"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              prefetch={false}
            >
              {t("topBar.links.contact.label")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {user && user.emailVerified ? (
            <Button variant="outline" size="sm">
              <Link href="/dashboard/home">
                {t("topBar.buttons.backToDashboard.label")}
              </Link>
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button variant="outline">
                <Link href="/login">{t("topBar.buttons.logIn.label")}</Link>
              </Button>
              <Button>
                <Link href="/signup">{t("topBar.buttons.signUp.label")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
