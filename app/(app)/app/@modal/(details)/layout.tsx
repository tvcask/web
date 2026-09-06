import { DetailWorkspace } from "@/components/ui/detail-workspace";

export default function DetailModalLayout({ children }: { children: React.ReactNode }) {
  return <DetailWorkspace>{children}</DetailWorkspace>;
}
