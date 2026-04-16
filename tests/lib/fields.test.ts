import { describe, it, expect } from "vitest";
import { filterFields } from "../../src/lib/fields";
import type { ViewerRole } from "../../src/lib/roles";

const customFields = [
  { id: "dietary", name: "Dietary Preferences", display_type: "text" as const, editable_by_member: true, default_sharing: "staff" as const },
  { id: "collection", name: "Hobbies", display_type: "image-gallery" as const, editable_by_member: true, default_sharing: "everyone" as const },
  { id: "notes", name: "VIP Notes", display_type: "text" as const, editable_by_member: false, default_sharing: "staff" as const },
  { id: "interests", name: "Interests", display_type: "badge-list" as const, editable_by_member: true, default_sharing: "members" as const },
];

const customData: Record<string, unknown> = {
  dietary: "Vegetarian",
  collection: [{ model: "Photo 1", year: 2024 }],
  notes: "Always seats by window",
  interests: ["Reading", "Coffee"],
};

const sharingPrefs: Record<string, string> = {
  collection: "none",
};

describe("filterFields", () => {
  it("owner sees all fields", () => {
    const result = filterFields({ customFields, customData, sharingPrefs, viewerRole: "owner" });
    expect(result.map(f => f.id)).toEqual(["dietary", "collection", "notes", "interests"]);
  });

  it("manager sees staff-level and above fields", () => {
    const result = filterFields({ customFields, customData, sharingPrefs, viewerRole: "manager" });
    expect(result.map(f => f.id)).toEqual(["dietary", "notes", "interests"]);
  });

  it("staff sees staff-level and above, respects sharing overrides", () => {
    const result = filterFields({ customFields, customData, sharingPrefs, viewerRole: "staff" });
    expect(result.map(f => f.id)).toEqual(["dietary", "notes", "interests"]);
  });

  it("member sees members-level and above, respects sharing overrides", () => {
    const result = filterFields({ customFields, customData, sharingPrefs, viewerRole: "member" });
    expect(result.map(f => f.id)).toEqual(["interests"]);
  });

  it("public sees only everyone-level fields", () => {
    const result = filterFields({ customFields, customData, sharingPrefs: {}, viewerRole: "public" });
    expect(result.map(f => f.id)).toEqual(["collection"]);
  });

  it("public sees nothing when all fields are restricted", () => {
    const result = filterFields({ customFields, customData, sharingPrefs, viewerRole: "public" });
    expect(result.map(f => f.id)).toEqual([]);
  });
});
