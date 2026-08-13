import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";
import type { AuditLog } from "@/lib/types";

export function logAudit(
  store: {
    adminName: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: Record<string, unknown>;
    ip?: string;
  },
  s: { auditLogs: AuditLog[] }
) {
  s.auditLogs.unshift({
    id: uid("log_"),
    adminName: store.adminName,
    action: store.action,
    entity: store.entity,
    entityId: store.entityId,
    details: store.details,
    ip: store.ip,
    createdAt: new Date().toISOString(),
  });
  if (s.auditLogs.length > 1000) s.auditLogs.length = 1000;
}

export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}

export function adminName(
  s: { users: Array<{ id: string; name: string }> },
  adminId: string
): string {
  return s.users.find((u) => u.id === adminId)?.name || adminId;
}