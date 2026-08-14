import { DetailDrawer } from "@/components/ui/detail-drawer";

export default function PersonModalLayout({ children }: { children: React.ReactNode }) {
  return <DetailDrawer label="Actor details">{children}</DetailDrawer>;
}
