"use client";

import { use } from "react";
import { AppShell } from "@/components/app-shell";
import { CardDetail } from "@/components/card-detail";

export default function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppShell>
      <CardDetail cardId={id} />
    </AppShell>
  );
}
