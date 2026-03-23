CREATE TYPE "public"."card_status" AS ENUM('active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."dashboard_role" AS ENUM('admin', 'manager', 'analyst');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('active', 'suspended', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."scanned_by_type" AS ENUM('member', 'dashboard_user');--> statement-breakpoint
CREATE TYPE "public"."tap_role" AS ENUM('manager', 'staff');--> statement-breakpoint
CREATE TYPE "public"."verify_result" AS ENUM('authentic', 'invalid', 'replay', 'error');--> statement-breakpoint
CREATE TYPE "public"."viewer_role" AS ENUM('owner', 'member', 'manager', 'staff', 'public');--> statement-breakpoint
CREATE TABLE "club_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"branding" jsonb NOT NULL,
	"tiers" jsonb NOT NULL,
	"custom_fields" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboard_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "dashboard_role" NOT NULL,
	"tap_role" "tap_role",
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dashboard_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "member_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"card_uid" text NOT NULL,
	"status" "card_status" DEFAULT 'active' NOT NULL,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"tier" text NOT NULL,
	"credit_balance" integer DEFAULT 0 NOT NULL,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sharing_prefs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "member_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tap_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_uid" text NOT NULL,
	"member_id" uuid,
	"scanned_by_id" uuid,
	"scanned_by_type" "scanned_by_type",
	"viewer_role" "viewer_role" NOT NULL,
	"verified" "verify_result" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_cards" ADD CONSTRAINT "member_cards_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tap_logs" ADD CONSTRAINT "tap_logs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;