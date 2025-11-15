"use client";

import clsx from "clsx";

export default function Badge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full font-medium text-sm shadow-md",
        ok 
          ? "bg-linear-to-r from-green-500 to-green-600 text-white" 
          : "bg-linear-to-r from-red-600 to-red-700 text-white"
      )}
    >
      {label} {ok ? "✓" : "✗"}
    </span>
  );
}
