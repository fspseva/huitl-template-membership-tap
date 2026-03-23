export type ViewerRole = "owner" | "member" | "manager" | "staff" | "public";

interface RoleInput {
  session: { email: string; name: string } | null;
  cardOwnerEmail: string;
  member: { id: string; email: string } | null;
  dashboardUser: { id: string; email: string; tapRole: "manager" | "staff" | null } | null;
}

export function resolveRole(input: RoleInput): ViewerRole {
  const { session, cardOwnerEmail, member, dashboardUser } = input;

  if (!session) return "public";
  if (session.email === cardOwnerEmail) return "owner";
  if (dashboardUser?.tapRole === "manager") return "manager";
  if (dashboardUser?.tapRole === "staff") return "staff";
  if (member) return "member";

  return "public";
}
