"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[var(--muted)] text-[12px] hover:text-[var(--foreground)] transition-colors"
    >
      Sign out
    </button>
  );
}
