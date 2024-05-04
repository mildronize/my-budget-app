import { useQuery } from "@tanstack/react-query";
import type * as VersionGet from "@/app/api/version/route";
import { InferRouteResponse } from "@/types";

export type VersionGetResponse = InferRouteResponse<typeof VersionGet.GET>;

export function useVersion() {
  const version = useQuery<VersionGetResponse>({
    queryKey: ["version"],
    queryFn: async () => {
      const response = await fetch("/api/version");
      return response.json();
    },
  });

  return {
    value: version.data?.format === "text" ? version.data.version : "",
    isLoading: version.isLoading,
    isError: version.isError,
  };
}
