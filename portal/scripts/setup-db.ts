import { neon } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_JGY3PNIXWe2D@ep-orange-water-ayb9mumo-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const client = neon(DATABASE_URL);
const run = (stmt: string) => client.query(stmt);

async function setup() {
  console.log('Setting up Noryvex database schema on Neon...\n');

  const statements = [
    // Enums
    `DO $$ BEGIN CREATE TYPE "userRoleEnum" AS ENUM ('super_admin', 'client_owner'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "workspaceStatusEnum" AS ENUM ('active', 'suspended', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "callOutcomeEnum" AS ENUM ('answered', 'missed', 'voicemail', 'transferred'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "leadStatusEnum" AS ENUM ('new', 'qualified', 'booked', 'not_interested'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "sentimentEnum" AS ENUM ('positive', 'neutral', 'negative', 'unknown'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "appointmentStatusEnum" AS ENUM ('upcoming', 'completed', 'cancelled', 'no_show'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "patientStatusEnum" AS ENUM ('new', 'active', 'follow_up', 'inactive'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "webhookStatusEnum" AS ENUM ('pending', 'processed', 'failed'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "knowledgeTypeEnum" AS ENUM ('faq', 'hours', 'service', 'pricing', 'insurance', 'emergency', 'document', 'url'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "workspaceMemberRoleEnum" AS ENUM ('client_owner'); EXCEPTION WHEN duplicate_object THEN null; END $$`,

    // Tables
    `CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" text UNIQUE NOT NULL,
      "password_hash" text NOT NULL,
      "full_name" text NOT NULL,
      "role" "userRoleEnum" NOT NULL DEFAULT 'client_owner',
      "email_verified" boolean DEFAULT false,
      "created_at" timestamp DEFAULT now(),
      "deleted_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "refresh_tokens" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
      "token_hash" text NOT NULL,
      "expires_at" timestamp NOT NULL,
      "revoked_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "password_resets" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
      "token_hash" text NOT NULL,
      "expires_at" timestamp NOT NULL,
      "used_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "workspaces" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "subdomain" text UNIQUE NOT NULL,
      "industry" text NOT NULL,
      "status" "workspaceStatusEnum" NOT NULL DEFAULT 'active',
      "timezone" text NOT NULL DEFAULT 'UTC',
      "created_at" timestamp DEFAULT now(),
      "deleted_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "workspace_members" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid REFERENCES "workspaces"("id") ON DELETE CASCADE,
      "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
      "role" "workspaceMemberRoleEnum" NOT NULL DEFAULT 'client_owner'
    )`,

    `CREATE TABLE IF NOT EXISTS "calls" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid REFERENCES "workspaces"("id") NOT NULL,
      "vapi_call_id" text UNIQUE NOT NULL,
      "caller_name" text,
      "caller_phone" text NOT NULL,
      "duration_seconds" integer DEFAULT 0,
      "outcome" "callOutcomeEnum",
      "lead_status" "leadStatusEnum" DEFAULT 'new',
      "sentiment" "sentimentEnum" DEFAULT 'unknown',
      "recording_url" text,
      "transcript" text,
      "ai_summary" text,
      "appointment_created" boolean DEFAULT false,
      "internal_notes" text,
      "raw_vapi_payload" jsonb,
      "created_at" timestamp DEFAULT now(),
      "deleted_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "patients" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid REFERENCES "workspaces"("id") NOT NULL,
      "name" text NOT NULL,
      "phone" text,
      "email" text,
      "treatment_requested" text,
      "status" "patientStatusEnum" DEFAULT 'new',
      "tags" text[],
      "notes" text,
      "created_at" timestamp DEFAULT now(),
      "deleted_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "appointments" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid REFERENCES "workspaces"("id") NOT NULL,
      "patient_id" uuid REFERENCES "patients"("id"),
      "call_id" uuid REFERENCES "calls"("id"),
      "service" text,
      "start_time" timestamp NOT NULL DEFAULT now(),
      "end_time" timestamp,
      "status" "appointmentStatusEnum" DEFAULT 'upcoming',
      "booked_by_ai" boolean DEFAULT false,
      "notes" text,
      "created_at" timestamp DEFAULT now(),
      "deleted_at" timestamp
    )`,

    `CREATE TABLE IF NOT EXISTS "knowledge_documents" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid REFERENCES "workspaces"("id") NOT NULL,
      "type" "knowledgeTypeEnum" NOT NULL,
      "title" text NOT NULL,
      "content" text,
      "file_url" text,
      "source_url" text,
      "is_active" boolean DEFAULT true,
      "created_at" timestamp DEFAULT now()
    )`,

    `CREATE TABLE IF NOT EXISTS "vapi_assistants" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid UNIQUE REFERENCES "workspaces"("id") NOT NULL,
      "vapi_id" text UNIQUE NOT NULL,
      "name" text NOT NULL,
      "voice_id" text,
      "model" text DEFAULT 'gpt-4o',
      "system_prompt" text,
      "first_message" text,
      "created_at" timestamp DEFAULT now()
    )`,

    `CREATE TABLE IF NOT EXISTS "phone_numbers" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "workspace_id" uuid REFERENCES "workspaces"("id"),
      "number" text UNIQUE NOT NULL,
      "transfer_number" text,
      "is_active" boolean DEFAULT true
    )`,

    `CREATE TABLE IF NOT EXISTS "webhook_events" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "vapi_call_id" text,
      "event_type" text NOT NULL,
      "payload" jsonb NOT NULL,
      "status" "webhookStatusEnum" DEFAULT 'pending',
      "attempts" integer DEFAULT 0,
      "error_log" text,
      "created_at" timestamp DEFAULT now()
    )`,

    `CREATE TABLE IF NOT EXISTS "contact_inquiries" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text,
      "message" text,
      "created_at" timestamp DEFAULT now()
    )`,

    `CREATE TABLE IF NOT EXISTS "meeting_bookings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text,
      "company" text,
      "preferred_date" text,
      "status" text DEFAULT 'pending',
      "created_at" timestamp DEFAULT now()
    )`,

    `CREATE TABLE IF NOT EXISTS "trial_requests" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text,
      "business_name" text,
      "industry" text,
      "message" text,
      "created_at" timestamp DEFAULT now()
    )`,
  ];

  for (const stmt of statements) {
    try {
      await run(stmt);
      const label = stmt.trim().split('\n')[0].substring(0, 60);
      console.log(`✓ ${label}`);
    } catch (err: any) {
      console.error(`✗ Error: ${err.message}`);
      console.error(`  Statement: ${stmt.trim().substring(0, 80)}`);
    }
  }

  console.log('\n✅ Schema setup complete!');
}

setup().catch(console.error);
