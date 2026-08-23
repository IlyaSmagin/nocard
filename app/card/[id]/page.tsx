import { AppShell } from "@/components/app-shell";
import { CardDetail } from "@/components/card-detail";
import { STATIC_SAMPLE_IDS } from "@/lib/db";

export function generateStaticParams() {
  return STATIC_SAMPLE_IDS.map((id) => ({ id }));
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <CardDetail cardId={id} />
    </AppShell>
  );
}
