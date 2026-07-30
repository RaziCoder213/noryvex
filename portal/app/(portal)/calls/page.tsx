import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, ilike, or, and } from "drizzle-orm";
import Badge from "@/components/shared/Badge";

export const metadata = { title: "Calls" };

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; outcome?: string; page?: string }>;
}) {
  const session = await getServerSession();
  if (!session || !session.userId) redirect("/login");

  const memberships = await db
    .select({ workspaceId: schema.workspaceMembers.workspaceId })
    .from(schema.workspaceMembers)
    .where(eq(schema.workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = memberships[0]?.workspaceId;
  if (!workspaceId) redirect("/login");

  const params = await searchParams;
  const search = params.search || "";
  const outcome = params.outcome as schema.CallOutcome | undefined;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 25;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(schema.calls.workspaceId, workspaceId)];

  if (search) {
    conditions.push(
      or(
        ilike(schema.calls.callerName, `%${search}%`),
        ilike(schema.calls.callerPhone, `%${search}%`)
      )!
    );
  }

  if (outcome) {
    conditions.push(eq(schema.calls.outcome, outcome));
  }

  const callsList = await db
    .select()
    .from(schema.calls)
    .where(and(...conditions))
    .orderBy(desc(schema.calls.createdAt))
    .limit(pageSize)
    .offset(offset);

  const outcomeColors: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
    answered: 'success',
    missed: 'danger',
    voicemail: 'warning',
    transferred: 'default',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Calls</h1>
        <p className="text-[#71717a] text-sm mt-1">All inbound calls handled by your AI receptionist</p>
      </div>

      {/* Search + Filter */}
      <form method="GET" className="flex gap-3 flex-wrap">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by caller name or phone..."
          className="flex-1 min-w-[200px] bg-[#111111] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1] transition-colors"
        />
        <select
          name="outcome"
          defaultValue={outcome ?? ""}
          className="bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1] transition-colors"
        >
          <option value="">All Outcomes</option>
          <option value="answered">Answered</option>
          <option value="missed">Missed</option>
          <option value="voicemail">Voicemail</option>
          <option value="transferred">Transferred</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6366f1] hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
        >
          Filter
        </button>
      </form>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#222222]">
            <tr>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Caller</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Phone</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Outcome</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Duration</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Sentiment</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Date</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {callsList.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#71717a]">
                  No calls found.
                </td>
              </tr>
            ) : (
              callsList.map((call) => (
                <tr key={call.id} className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{call.callerName || 'Unknown'}</td>
                  <td className="px-4 py-3 text-[#a1a1aa]">{call.callerPhone}</td>
                  <td className="px-4 py-3">
                    <Badge variant={outcomeColors[call.outcome ?? ''] ?? 'default'}>
                      {call.outcome ?? 'unknown'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#a1a1aa]">{formatDuration(call.durationSeconds)}</td>
                  <td className="px-4 py-3 text-[#a1a1aa] capitalize">{call.sentiment ?? '—'}</td>
                  <td className="px-4 py-3 text-[#71717a] text-xs">
                    {new Date(call.createdAt ?? Date.now()).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/calls/${call.id}`}
                      className="text-[#6366f1] hover:text-indigo-400 text-xs transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[#222222]">
          <p className="text-[#71717a] text-sm">Page {page}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/calls?${search ? `search=${search}&` : ''}${outcome ? `outcome=${outcome}&` : ''}page=${page - 1}`}
                className="px-3 py-1 text-sm bg-[#1a1a1a] border border-[#222222] rounded text-white hover:border-[#6366f1] transition-colors"
              >
                Previous
              </a>
            )}
            {callsList.length === pageSize && (
              <a
                href={`/calls?${search ? `search=${search}&` : ''}${outcome ? `outcome=${outcome}&` : ''}page=${page + 1}`}
                className="px-3 py-1 text-sm bg-[#1a1a1a] border border-[#222222] rounded text-white hover:border-[#6366f1] transition-colors"
              >
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
