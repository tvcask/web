"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is already fresh from the server render; avoid a refetch storm.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined;

// One client per request on the server, one shared client in the browser.
function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
