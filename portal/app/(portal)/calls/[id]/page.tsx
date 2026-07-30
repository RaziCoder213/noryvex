import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { calls, workspaceMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import Badge from "@/components/shared/Badge";
import AudioPlayer from "@/components/shared/AudioPlayer";
import { InternalNotes } from "./InternalNotes";

export const metadata = {
  title: "Call Details",
};

export default async function CallDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || !session.userId) redirect("/login");

  const userMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = userMemberships[0]?.workspaceId;
  if (!workspaceId) redirect("/login");

  const resolvedParams = await params;
  const callId = resolvedParams.id;

  const callDataList = await db
    .select()
    .from(calls)
    .where(and(eq(calls.id, callId), eq(calls.workspaceId, workspaceId)))
    .limit(1);

  const call = callDataList[0];

  if (!call) {
    return (
      <div className="p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white">Call Not Found</h1>
        <p className="text-gray-400">The requested call could not be found or you don't have access to it.</p>
        <Link href="/calls" className="text-blue-500 hover:underline">← Back to Calls</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-8 max-w-6xl mx-auto w-full gap-6">
      <Link href="/calls" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-2 w-max">
        ← Back to Calls
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111] border border-[#222222] p-6 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{call.callerName || 'Unknown Caller'}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{call.callerPhone}</span>
            <span>•</span>
            <span>{new Date(call.createdAt ?? Date.now()).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={call.outcome === 'answered' ? 'success' : 'default'}>{call.outcome}</Badge>
          <Badge variant="default">Sentiment: {call.sentiment || 'Unknown'}</Badge>
        </div>
      </div>

      {call.recordingUrl && (
        <div className="bg-[#111111] border border-[#222222] p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Recording</h2>
          <AudioPlayer url={call.recordingUrl!} duration={call.durationSeconds ?? undefined} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#222222] p-6 rounded-xl flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">AI Summary</h2>
          <div className="text-gray-300 text-sm leading-relaxed flex-1 whitespace-pre-wrap">
            {call.aiSummary || 'No summary available for this call.'}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#222222] p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">Call Details</h2>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <span className="block text-gray-500 mb-1">Duration</span>
              <span className="text-white font-medium">{call.durationSeconds ?? 0} seconds</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Outcome</span>
              <span className="text-white font-medium capitalize">{call.outcome}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Lead Status</span>
              <span className="text-white font-medium capitalize">{call.leadStatus || 'None'}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Appointment Created</span>
              <span className="text-white font-medium">{call.appointmentCreated ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#222222] p-6 rounded-xl max-h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Transcript</h2>
          <div className="overflow-y-auto pr-2 space-y-4 text-sm flex-1">
            {call.transcript ? (
              <div className="text-gray-300 whitespace-pre-wrap">{call.transcript}</div>
            ) : (
              <span className="text-gray-500">Transcript not available.</span>
            )}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#222222] p-6 rounded-xl flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Internal Notes</h2>
          <InternalNotes callId={call.id} initialNotes={call.internalNotes || ''} />
        </div>
      </div>
    </div>
  );
}
