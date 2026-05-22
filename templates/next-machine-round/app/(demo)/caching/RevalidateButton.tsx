"use client";

import { useTransition } from "react";
import { revalidatePostsAction } from "@/lib/actions";

export function RevalidateButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await revalidatePostsAction();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
    >
      {isPending ? "Revalidating…" : "Revalidate posts cache"}
    </button>
  );
}
