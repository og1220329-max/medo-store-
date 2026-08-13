"use client";

import { useEffect, useState } from "react";

export function useAdminFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = () => {
    setLoading(true);
    fetch(url, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("فشل التحميل");
        return r.json();
      })
      .then((d) => setData(d as T))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { data, loading, error, reload };
}