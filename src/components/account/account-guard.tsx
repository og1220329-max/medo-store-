"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AccountGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user) {
          router.replace("/auth/login?next=/account");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => router.replace("/auth/login?next=/account"));
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="size-10 animate-spin rounded-full border-3 border-volt-500 border-t-transparent" />
      </div>
    );
  }
  if (status === "denied") return null;
  return <>{children}</>;
}