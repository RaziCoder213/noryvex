import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('userRoleEnum', ['super_admin', 'client_owner']);
export const workspaceStatusEnum = pgEnum('workspaceStatusEnum', ['active', 'suspended', 'cancelled']);
export const callOutcomeEnum = pgEnum('callOutcomeEnum', ['answered', 'missed', 'voicemail', 'transferred']);
export const leadStatusEnum = pgEnum('leadStatusEnum', ['new', 'qualified', 'booked', 'not_interested']);
export const sentimentEnum = pgEnum('sentimentEnum', ['positive', 'neutral', 'negative', 'unknown']);
export const appointmentStatusEnum = pgEnum('appointmentStatusEnum', ['upcoming', 'completed', 'cancelled', 'no_show']);
export const patientStatusEnum = pgEnum('patientStatusEnum', ['new', 'active', 'follow_up', 'inactive']);
export const webhookStatusEnum = pgEnum('webhookStatusEnum', ['pending', 'processed', 'failed']);
export const knowledgeTypeEnum = pgEnum('knowledgeTypeEnum', ['faq', 'hours', 'service', 'pricing', 'insurance', 'emergency', 'document', 'url']);
export const workspaceMemberRoleEnum = pgEnum('workspaceMemberRoleEnum', ['client_owner']);

// Tables

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: userRoleEnum('role').notNull().default('client_owner'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
});
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export const passwordResets = pgTable('password_resets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
});
export type PasswordReset = typeof passwordResets.$inferSelect;
export type NewPasswordReset = typeof passwordResets.$inferInsert;

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  subdomain: text('subdomain').unique().notNull(),
  industry: text('industry').notNull(),
  status: workspaceStatusEnum('status').notNull().default('active'),
  timezone: text('timezone').notNull().default('UTC'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  role: workspaceMemberRoleEnum('role').notNull().default('client_owner'),
});
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

export const calls = pgTable('calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  vapiCallId: text('vapi_call_id').unique().notNull(),
  callerName: text('caller_name'),
  callerPhone: text('caller_phone').notNull(),
  durationSeconds: integer('duration_seconds').default(0),
  outcome: callOutcomeEnum('outcome'),
  leadStatus: leadStatusEnum('lead_status').default('new'),
  sentiment: sentimentEnum('sentiment').default('unknown'),
  recordingUrl: text('recording_url'),
  transcript: text('transcript'),
  aiSummary: text('ai_summary'),
  appointmentCreated: boolean('appointment_created').default(false),
  internalNotes: text('internal_notes'),
  rawVapiPayload: jsonb('raw_vapi_payload'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type Call = typeof calls.$inferSelect;
export type NewCall = typeof calls.$inferInsert;

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  treatmentRequested: text('treatment_requested'),
  status: patientStatusEnum('status').default('new'),
  tags: text('tags').array(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  patientId: uuid('patient_id').references(() => patients.id),
  callId: uuid('call_id').references(() => calls.id),
  service: text('service'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  status: appointmentStatusEnum('status').default('upcoming'),
  bookedByAi: boolean('booked_by_ai').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export const knowledgeDocuments = pgTable('knowledge_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  type: knowledgeTypeEnum('type').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  fileUrl: text('file_url'),
  sourceUrl: text('source_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
export type KnowledgeDocument = typeof knowledgeDocuments.$inferSelect;
export type NewKnowledgeDocument = typeof knowledgeDocuments.$inferInsert;

export const vapiAssistants = pgTable('vapi_assistants', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').unique().references(() => workspaces.id).notNull(),
  vapiId: text('vapi_id').unique().notNull(),
  name: text('name').notNull(),
  voiceId: text('voice_id'),
  model: text('model').default('gpt-4o'),
  systemPrompt: text('system_prompt'),
  firstMessage: text('first_message'),
  createdAt: timestamp('created_at').defaultNow(),
});
export type VapiAssistant = typeof vapiAssistants.$inferSelect;
export type NewVapiAssistant = typeof vapiAssistants.$inferInsert;

export const phoneNumbers = pgTable('phone_numbers', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  number: text('number').unique().notNull(),
  transferNumber: text('transfer_number'),
  isActive: boolean('is_active').default(true),
});
export type PhoneNumber = typeof phoneNumbers.$inferSelect;
export type NewPhoneNumber = typeof phoneNumbers.$inferInsert;

export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  vapiCallId: text('vapi_call_id'),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  status: webhookStatusEnum('status').default('pending'),
  attempts: integer('attempts').default(0),
  errorLog: text('error_log'),
  createdAt: timestamp('created_at').defaultNow(),
});
export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type NewWebhookEvent = typeof webhookEvents.$inferInsert;

export const contactInquiries = pgTable('contact_inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type NewContactInquiry = typeof contactInquiries.$inferInsert;

export const meetingBookings = pgTable('meeting_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  preferredDate: text('preferred_date'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});
export type MeetingBooking = typeof meetingBookings.$inferSelect;
export type NewMeetingBooking = typeof meetingBookings.$inferInsert;

export const trialRequests = pgTable('trial_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  businessName: text('business_name'),
  industry: text('industry'),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});
export type TrialRequest = typeof trialRequests.$inferSelect;
export type NewTrialRequest = typeof trialRequests.$inferInsert;

export type KnowledgeType = typeof knowledgeTypeEnum.enumValues[number];
export type PatientStatus = typeof patientStatusEnum.enumValues[number];
export type CallOutcome = typeof callOutcomeEnum.enumValues[number];
export type AppointmentStatus = typeof appointmentStatusEnum.enumValues[number];
export type WorkspaceStatus = typeof workspaceStatusEnum.enumValues[number];


