import type { ViewerRole } from "./roles";

type SharingLevel = "everyone" | "members" | "staff" | "none";

interface CustomField {
  id: string;
  name: string;
  display_type: string;
  editable_by_member: boolean;
  default_sharing: SharingLevel;
}

interface FilterInput {
  customFields: CustomField[];
  customData: Record<string, unknown>;
  sharingPrefs: Record<string, string>;
  viewerRole: ViewerRole;
}

interface VisibleField {
  id: string;
  name: string;
  display_type: string;
  value: unknown;
}

const VISIBILITY_RANK: Record<SharingLevel, number> = {
  everyone: 0,
  members: 1,
  staff: 2,
  none: 3,
};

const ROLE_VISIBILITY: Record<ViewerRole, number> = {
  owner: 3,
  manager: 2,
  staff: 2,
  member: 1,
  public: 0,
};

export function filterFields(input: FilterInput): VisibleField[] {
  const { customFields, customData, sharingPrefs, viewerRole } = input;

  if (viewerRole === "owner") {
    return customFields.map(f => ({
      id: f.id,
      name: f.name,
      display_type: f.display_type,
      value: customData[f.id],
    }));
  }

  const maxRank = ROLE_VISIBILITY[viewerRole];

  return customFields
    .filter(f => {
      const sharing = (sharingPrefs[f.id] || f.default_sharing) as SharingLevel;
      return VISIBILITY_RANK[sharing] <= maxRank;
    })
    .map(f => ({
      id: f.id,
      name: f.name,
      display_type: f.display_type,
      value: customData[f.id],
    }));
}
