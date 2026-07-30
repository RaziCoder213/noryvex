import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import crypto from 'crypto';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  let webhookEventId: string | null = null;
  
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-vapi-signature');
    const secret = process.env.VAPI_WEBHOOK_SECRET;

    if (secret) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      const hmac = crypto.createHmac('sha256', secret);
      const computedSignature = hmac.update(rawBody).digest('base64');
      
      const signatureBuffer = Buffer.from(signature);
      const computedSignatureBuffer = Buffer.from(computedSignature);

      if (signatureBuffer.length !== computedSignatureBuffer.length || !crypto.timingSafeEqual(signatureBuffer, computedSignatureBuffer)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.message?.type || payload.type;

    // Insert into webhook_events
    const [insertedEvent] = await db.insert(schema.webhookEvents).values({
      eventType: eventType,
      payload: payload,
      status: 'pending',
    }).returning({ id: schema.webhookEvents.id });
    
    webhookEventId = insertedEvent.id;

    if (eventType === 'call.started') {
      const call = payload.message?.call || payload.call;
      const vapiCallId = call.id;
      const callerPhone = call.customer?.number;
      const callerName = call.customer?.name;
      const assistantId = call.assistantId;

      let workspaceId: string | null = null;
      if (assistantId) {
        const [assistant] = await db
          .select()
          .from(schema.vapiAssistants)
          .where(eq(schema.vapiAssistants.vapiId, assistantId));
          
        if (assistant) {
          workspaceId = assistant.workspaceId;
        }
      }

      if (!workspaceId) {
        return NextResponse.json({ error: 'Unknown assistant' }, { status: 422 });
      }

      await db.insert(schema.calls).values({
        vapiCallId,
        callerPhone,
        callerName,
        workspaceId,
      });

      await db
        .update(schema.webhookEvents)
        .set({ status: 'processed' })
        .where(eq(schema.webhookEvents.id, webhookEventId));

    } else if (eventType === 'end-of-call-report') {
      const call = payload.message?.call || payload.call;
      const analysis = payload.message?.analysis || payload.analysis;
      const artifact = payload.message?.artifact || payload.artifact;
      
      const vapiCallId = call.id;
      const callerPhone = call.customer?.number;
      const aiSummary = analysis?.summary;
      const transcript = artifact?.transcript;
      const recordingUrl = artifact?.recordingUrl;
      const endedReason = call.endedReason;
      
      const startedAt = call.startedAt ? new Date(call.startedAt).getTime() : null;
      const endedAt = call.endedAt ? new Date(call.endedAt).getTime() : null;
      const durationSeconds = (startedAt && endedAt) ? Math.floor((endedAt - startedAt) / 1000) : null;

      let outcome = 'unknown';
      if (endedReason === 'customer-ended-call' || endedReason === 'assistant-ended-call') {
        outcome = 'answered';
      } else if (endedReason === 'voicemail') {
        outcome = 'voicemail';
      } else if (endedReason === 'no-answer') {
        outcome = 'missed';
      } else if (endedReason === 'assistant-forwarded-call') {
        outcome = 'transferred';
      }

      let appointmentCreated = false;
      if (aiSummary) {
        const lowerSummary = aiSummary.toLowerCase();
        if (lowerSummary.includes('appointment') || lowerSummary.includes('booked') || lowerSummary.includes('scheduled')) {
          appointmentCreated = true;
        }
      }

      // Lookup workspaceId from existing call or assistant
      let workspaceIdForCall: string | null = null;
      const [existingCallForWs] = await db
        .select({ workspaceId: schema.calls.workspaceId })
        .from(schema.calls)
        .where(eq(schema.calls.vapiCallId, vapiCallId))
        .limit(1);
      if (existingCallForWs) workspaceIdForCall = existingCallForWs.workspaceId;

      const existingCallFull = await db.select().from(schema.calls).where(eq(schema.calls.vapiCallId, vapiCallId));

      if (existingCallFull.length > 0) {
        await db
          .update(schema.calls)
          .set({
            callerPhone,
            aiSummary,
            transcript,
            recordingUrl,
            outcome: outcome as schema.CallOutcome,
            durationSeconds,
            appointmentCreated,
          })
          .where(eq(schema.calls.vapiCallId, vapiCallId));
      } else if (workspaceIdForCall) {
        await db.insert(schema.calls).values({
          vapiCallId,
          callerPhone,
          aiSummary,
          transcript,
          recordingUrl,
          outcome: outcome as schema.CallOutcome,
          durationSeconds,
          appointmentCreated,
          workspaceId: workspaceIdForCall,
        });
      }

      await db
        .update(schema.webhookEvents)
        .set({ status: 'processed' })
        .where(eq(schema.webhookEvents.id, webhookEventId));

    } else if (eventType === 'tool-calls') {
      const toolCalls = payload.message?.toolCalls || payload.toolCalls;
      const call = payload.message?.call || payload.call;
      const vapiCallId = call.id;
      const assistantId = call.assistantId;

      let workspaceId: string | null = null;
      if (assistantId) {
        const [assistant] = await db
          .select()
          .from(schema.vapiAssistants)
          .where(eq(schema.vapiAssistants.vapiId, assistantId));
          
        if (assistant) {
          workspaceId = assistant.workspaceId;
        }
      }

      for (const toolCall of toolCalls) {
        if (toolCall.type === 'function' && toolCall.function?.name === 'book_appointment') {
          const args = JSON.parse(toolCall.function.arguments || '{}');
          const { patientName, phone, service, appointmentTime } = args;

          if (workspaceId && phone) {
            let [patient] = await db
              .select()
              .from(schema.patients)
              .where(eq(schema.patients.phone, phone)); 

            if (!patient) {
              [patient] = await db.insert(schema.patients).values({
                workspaceId,
                name: patientName || 'Unknown',
                phone: phone,
              }).returning();
            }

            const [callRecord] = await db
              .select()
              .from(schema.calls)
              .where(eq(schema.calls.vapiCallId, vapiCallId));

            await db.insert(schema.appointments).values({
              workspaceId,
              patientId: patient.id,
              callId: callRecord?.id || null,
              service,
              startTime: new Date(appointmentTime),
              status: 'upcoming',
              bookedByAi: true,
            });
          }
        }
      }

      await db
        .update(schema.webhookEvents)
        .set({ status: 'processed' })
        .where(eq(schema.webhookEvents.id, webhookEventId));
    } else {
      // Other events
      await db
        .update(schema.webhookEvents)
        .set({ status: 'processed' })
        .where(eq(schema.webhookEvents.id, webhookEventId));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    if (webhookEventId) {
      await db
        .update(schema.webhookEvents)
        .set({ 
          status: 'failed', 
          errorLog: error.message || 'Unknown error',
          attempts: sql`COALESCE(${schema.webhookEvents.attempts}, 0) + 1`
        })
        .where(eq(schema.webhookEvents.id, webhookEventId));
    }

    // Always return 200 to prevent retries for non-transient errors
    return NextResponse.json({ success: true });
  }
}

