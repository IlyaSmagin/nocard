import { AppShell } from "@/components/app-shell";
import { AllCardsList } from "@/components/all-cards-list";

export const dynamic = "force-static";

export default function AllCardsPage() {
  return (
    <AppShell>
      <AllCardsList />
    </AppShell>
  );
}
