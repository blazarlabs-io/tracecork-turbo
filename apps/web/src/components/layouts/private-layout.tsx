import { SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppSidebar>
      <main className="overflow-hidden p-1 sm:p-2 md:p-3 lg:p-6">
        {children}
      </main>
    </AppSidebar>
  );
};
