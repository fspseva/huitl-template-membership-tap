import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.redirectTo) query.set("redirectTo", params.redirectTo);
  if (params.error) query.set("error", params.error);
  const qs = query.toString();
  redirect(qs ? `/?${qs}` : "/");
}
