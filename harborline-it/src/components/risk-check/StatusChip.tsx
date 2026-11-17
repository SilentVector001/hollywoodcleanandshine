import { statusLabels, type ItemStatus } from "@/lib/risk-check";

const styles: Record<ItemStatus, string> = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  attention: "bg-amber-50 text-amber-800 ring-amber-600/25",
  risk: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function StatusChip({ status }: { status: ItemStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
