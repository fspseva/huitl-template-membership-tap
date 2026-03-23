import { pgTable, uuid, text, integer, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";

// -- Enums --

export const memberStatusEnum = pgEnum("member_status", ["active", "suspended", "revoked"]);
export const cardStatusEnum = pgEnum("card_status", ["active", "revoked"]);
export const dashboardRoleEnum = pgEnum("dashboard_role", ["admin", "manager", "analyst"]);
export const tapRoleEnum = pgEnum("tap_role", ["manager", "staff"]);
export const viewerRoleEnum = pgEnum("viewer_role", ["owner", "member", "manager", "staff", "public"]);
export const scannedByTypeEnum = pgEnum("scanned_by_type", ["member", "dashboard_user"]);
export const verifyResultEnum = pgEnum("verify_result", ["authentic", "invalid", "replay", "error"]);

// -- Tables --

export const clubConfig = pgTable("club_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  branding: jsonb("branding").notNull().$type<{
    logo: string;
    primary_color: string;
    secondary_color: string;
  }>(),
  tiers: jsonb("tiers").notNull().$type<Array<{
    id: string;
    name: string;
    badge_color: string;
    order: number;
  }>>(),
  customFields: jsonb("custom_fields").notNull().$type<Array<{
    id: string;
    name: string;
    display_type: "text" | "number" | "image-gallery" | "badge-list" | "key-value" | "progress-bar";
    editable_by_member: boolean;
    default_sharing: "everyone" | "members" | "staff" | "none";
  }>>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  tier: text("tier").notNull(),
  creditBalance: integer("credit_balance").notNull().default(0),
  customData: jsonb("custom_data").notNull().default({}).$type<Record<string, unknown>>(),
  sharingPrefs: jsonb("sharing_prefs").notNull().default({}).$type<Record<string, string>>(),
  status: memberStatusEnum("status").notNull().default("active"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const memberCards = pgTable("member_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").notNull().references(() => members.id),
  cardUid: text("card_uid").notNull(),
  status: cardStatusEnum("status").notNull().default("active"),
  linkedAt: timestamp("linked_at").notNull().defaultNow(),
  revokedAt: timestamp("revoked_at"),
});

export const dashboardUsers = pgTable("dashboard_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: dashboardRoleEnum("role").notNull(),
  tapRole: tapRoleEnum("tap_role"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tapLogs = pgTable("tap_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardUid: text("card_uid").notNull(),
  memberId: uuid("member_id").references(() => members.id),
  scannedById: uuid("scanned_by_id"),
  scannedByType: scannedByTypeEnum("scanned_by_type"),
  viewerRole: viewerRoleEnum("viewer_role").notNull(),
  verified: verifyResultEnum("verified").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
