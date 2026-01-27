import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/templates";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract user info for the shell
  const userData = {
    id: user.id,
    email: user.email || undefined,
    name: user.user_metadata?.full_name || user.email?.split("@")[0],
    avatar: user.user_metadata?.avatar_url,
    plan: "Free", // TODO: Get from subscription
  };

  return (
    <DashboardShell user={userData}>
      {children}
    </DashboardShell>
  );
}
