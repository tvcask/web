import { TitleDrawer } from "@/components/titles/title-drawer";

export default function TitleModalLayout({ children }: { children: React.ReactNode }) {
  return <TitleDrawer>{children}</TitleDrawer>;
}
