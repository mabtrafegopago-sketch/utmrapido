import { ToastContainer } from "@/components/ui/Toast";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 min-h-screen bg-background">{children}</main>
      <ToastContainer />
    </>
  );
}
