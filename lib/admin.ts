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
  userGrowth: AdminUserGrowthPoint[];
};

export type AdminUserGrowthPoint = {
  date: string;
  totalUsers: number;
  newUsers: number;
};

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  trackedTitles: number;
  lists: number;
  latestImportStatus?: string;
  latestImportAt?: string;
};

export type AdminUserList = {
  users: AdminUserListItem[];
  page: number;
  pageSize: number;
  totalUsers: number;
  totalPages: number;
};

export type AdminUserImport = {
  status: string;
  totalTitles: number;
  matchedTitles: number;
  watchedEpisodes: number;
  importedLists: number;
  createdAt: string;
};

export type AdminUserDetail = {
  id: string;
  name: string;
  email: string;
  username?: string;
  emailVerified: boolean;
  createdAt: string;
  trackedTitles: number;
  watchedEpisodes: number;
  favorites: number;
  lists: number;
  completedImports: number;
  failedImports: number;
  recentImports: AdminUserImport[];
};

export type AdminUserFilters = {
  page?: number;
  verification?: "all" | "verified" | "unverified";
  period?: "24h" | "7d" | "30d";
};

export function getAdminStats(): Promise<AdminStats> {
  return api<AdminStats>("/v1/admin/stats");
}

export function getAdminUsers(filters: AdminUserFilters = {}): Promise<AdminUserList> {
  const params = new URLSearchParams();
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  if (filters.verification && filters.verification !== "all") params.set("verification", filters.verification);
  if (filters.period) params.set("period", filters.period);
  const suffix = params.size ? `?${params}` : "";
  return api<AdminUserList>(`/v1/admin/users${suffix}`);
}

export function getAdminUser(id: string): Promise<AdminUserDetail> {
  return api<AdminUserDetail>(`/v1/admin/users/${encodeURIComponent(id)}`);
}
