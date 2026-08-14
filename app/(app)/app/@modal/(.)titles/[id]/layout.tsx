import { DetailDrawer } from "@/components/ui/detail-drawer";

export default function TitleModalLayout({ children }: { children: React.ReactNode }) {
  return <DetailDrawer label="Title details">{children}</DetailDrawer>;
}
