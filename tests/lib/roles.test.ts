import { describe, it, expect } from "vitest";
import { resolveRole } from "../../src/lib/roles";

describe("resolveRole", () => {
  it("returns 'public' when no session", () => {
    expect(resolveRole({ session: null, cardOwnerEmail: "maria@example.com", member: null, dashboardUser: null }))
      .toBe("public");
  });

  it("returns 'owner' when session email matches card owner", () => {
    expect(resolveRole({
      session: { email: "maria@example.com", name: "Maria" },
      cardOwnerEmail: "maria@example.com",
      member: { id: "1", email: "maria@example.com" },
      dashboardUser: null,
    })).toBe("owner");
  });

  it("returns 'owner' even when user is also a manager (owner wins)", () => {
    expect(resolveRole({
      session: { email: "maria@example.com", name: "Maria" },
      cardOwnerEmail: "maria@example.com",
      member: { id: "1", email: "maria@example.com" },
      dashboardUser: { id: "2", email: "maria@example.com", tapRole: "manager" },
    })).toBe("owner");
  });

  it("returns 'manager' when session has manager tap_role and not owner", () => {
    expect(resolveRole({
      session: { email: "admin@club.com", name: "Admin" },
      cardOwnerEmail: "maria@example.com",
      member: null,
      dashboardUser: { id: "2", email: "admin@club.com", tapRole: "manager" },
    })).toBe("manager");
  });

  it("returns 'staff' when session has staff tap_role and not owner", () => {
    expect(resolveRole({
      session: { email: "host@club.com", name: "Host" },
      cardOwnerEmail: "maria@example.com",
      member: null,
      dashboardUser: { id: "3", email: "host@club.com", tapRole: "staff" },
    })).toBe("staff");
  });

  it("returns 'member' when session is a member but not owner and no tap_role", () => {
    expect(resolveRole({
      session: { email: "other@example.com", name: "Other" },
      cardOwnerEmail: "maria@example.com",
      member: { id: "4", email: "other@example.com" },
      dashboardUser: null,
    })).toBe("member");
  });

  it("returns 'public' when session exists but user is not member or staff", () => {
    expect(resolveRole({
      session: { email: "random@gmail.com", name: "Random" },
      cardOwnerEmail: "maria@example.com",
      member: null,
      dashboardUser: null,
    })).toBe("public");
  });

  it("returns 'manager' over 'member' when user is both", () => {
    expect(resolveRole({
      session: { email: "boss@club.com", name: "Boss" },
      cardOwnerEmail: "maria@example.com",
      member: { id: "5", email: "boss@club.com" },
      dashboardUser: { id: "6", email: "boss@club.com", tapRole: "manager" },
    })).toBe("manager");
  });
});
