import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { clubConfig } from "./schema.js";
import * as schema from "./schema.js";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // Idempotent: skip if config already exists
  const existing = await db.query.clubConfig.findFirst();
  if (existing) {
    console.log("Club config already exists, skipping seed.");
    return;
  }

  await db.insert(clubConfig).values({
    name: "Membership Club",
    branding: {
      logo: "",
      primary_color: "#2dd46c",
      secondary_color: "#141414",
    },
    tiers: [
      { id: "founding", name: "Founding Member", badge_color: "#f59e0b", order: 1 },
      { id: "member", name: "Member", badge_color: "#2dd46c", order: 2 },
    ],
    customFields: [
      {
        id: "dietary",
        name: "Dietary Preferences",
        display_type: "text",
        editable_by_member: true,
        default_sharing: "staff",
      },
      {
        id: "table_pref",
        name: "Table Preference",
        display_type: "text",
        editable_by_member: true,
        default_sharing: "staff",
      },
      {
        id: "notes",
        name: "VIP Notes",
        display_type: "text",
        editable_by_member: false,
        default_sharing: "staff",
      },
    ],
  });

  console.log("Club config seeded.");
}

seed().catch(console.error);
