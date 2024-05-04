import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { LocalStorage } from "@/libs/local-storage";

export function useQueryCache<T>(
  queryResult: UseQueryResult<T>,
  queryKey: string,
  initData?: T
) {
  const cache = useMemo(
    () => new LocalStorage<T>(queryKey, initData ?? ({} as T)),
    [queryKey, initData]
  );

  useEffect(() => {
    if (queryResult.data) {
      cache.set(queryResult.data);
    }
  }, [queryResult.data, cache]);

  return cache.get();
}
