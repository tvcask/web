import { api } from "@/lib/api";

export type AdminStats = {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  newUsers24Hours: number;
  newUsers7Days: number;
  newUsers30Days: number;
  completedImports: number;
  failedImports: number;
};

export function getAdminStats(): Promise<AdminStats> {
  return api<AdminStats>("/v1/admin/stats");
}
