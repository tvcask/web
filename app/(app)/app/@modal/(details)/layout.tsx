import { DetailDrawer } from "@/components/ui/detail-drawer";

// One layout for every detail route, so moving between a show, an actor and an
// episode swaps the content without remounting or re-sliding the drawer.
export default function DetailsLayout({ children }: { children: React.ReactNode }) {
  return <DetailDrawer>{children}</DetailDrawer>;
}
