import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <SiteHeader lang="ka" />
      <main>{children}</main>
      <SiteFooter lang="ka" />
    </div>
  );
}
