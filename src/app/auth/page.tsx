import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/markets");
  }

  const { mode } = await searchParams;
  const defaultMode = mode === "signup" ? "signup" : "signin";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/markets" className="mb-8">
        <Image
          src="/logo/logo-marketlab.webp"
          alt="MarketLab"
          width={677}
          height={369}
          className="h-8 w-auto object-contain"
          priority
        />
      </Link>
      <AuthForm defaultMode={defaultMode} />
    </div>
  );
}
