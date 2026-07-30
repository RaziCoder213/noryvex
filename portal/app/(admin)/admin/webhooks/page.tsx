import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import RetryButton from './RetryButton';

const statusColors: Record<string, { bg: string; text: string }> = {
  processed: { bg: 'bg-green-500/10', text: 'text-green-400' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
};

export default async function AdminWebhooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  const params = await searchParams;
  const statusFilter = params.status;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  const baseQuery = db
    .select()
    .from(schema.webhookEvents)
    .orderBy(sql`${schema.webhookEvents.createdAt} desc`)
    .limit(pageSize)
    .offset(offset);

  const events = statusFilter
    ? await db
        .select()
        .from(schema.webhookEvents)
        .where(eq(schema.webhookEvents.status, statusFilter as 'pending' | 'processed' | 'failed'))
        .orderBy(sql`${schema.webhookEvents.createdAt} desc`)
        .limit(pageSize)
        .offset(offset)
    : await baseQuery;

  const tabs = ['all', 'pending', 'processed', 'failed'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Webhook Events</h1>
        <p className="text-[#71717a] text-sm mt-1">Vapi webhook event log and retry queue</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-[#222222] pb-0">
        {tabs.map((tab) => {
          const active = (statusFilter ?? 'all') === tab;
          return (
            <a
              key={tab}
              href={tab === 'all' ? '/admin/webhooks' : `/admin/webhooks?status=${tab}`}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                active
                  ? 'border-[#6366f1] text-white'
                  : 'border-transparent text-[#71717a] hover:text-white'
              }`}
            >
              {tab}
            </a>
          );
        })}
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#222222]">
              <tr>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">ID</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Event Type</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Vapi Call ID</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Attempts</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Date</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#71717a]">
                    No webhook events found.
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const colors = statusColors[ev.status ?? 'pending'] ?? statusColors.pending;
                  return (
                    <tr key={ev.id} className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#a1a1aa]">
                        {ev.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3 text-white font-mono text-xs">{ev.eventType}</td>
                      <td className="px-4 py-3 text-[#a1a1aa] font-mono text-xs">
                        {ev.vapiCallId ? `${ev.vapiCallId.slice(0, 12)}…` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#a1a1aa]">{ev.attempts}</td>
                      <td className="px-4 py-3 text-[#71717a] text-xs">
                        {ev.createdAt ? new Date(ev.createdAt ?? Date.now()).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {ev.status === 'failed' && <RetryButton eventId={ev.id} />}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#222222]">
          <p className="text-[#71717a] text-sm">Page {page}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/webhooks?${statusFilter ? `status=${statusFilter}&` : ''}page=${page - 1}`}
                className="px-3 py-1 text-sm bg-[#1a1a1a] border border-[#222222] rounded text-white hover:border-[#6366f1] transition-colors"
              >
                Previous
              </a>
            )}
            {events.length === pageSize && (
              <a
                href={`/admin/webhooks?${statusFilter ? `status=${statusFilter}&` : ''}page=${page + 1}`}
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
