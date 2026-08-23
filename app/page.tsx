import { AppShell } from "@/components/app-shell";
import { HomeScreen } from "@/components/home-screen";

export const dynamic = "force-static";

export default function Home() {
  return (
    <AppShell>
      <HomeScreen />
    </AppShell>
  );
}
