import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from '@/lib/session';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { isNull, count, eq, desc } from 'drizzle-orm';

async function safeCount(query: () => Promise<{ count: number | string }[]>): Promise<number> {
  try {
    const result = await query();
    return Number(result[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  const [
    totalWorkspaces,
    totalCalls,
    totalPatients,
    totalAppointments,
    failedWebhooks,
  ] = await Promise.allSettled([
    safeCount(() => db.select({ count: count() }).from(schema.workspaces).where(isNull(schema.workspaces.deletedAt))),
    safeCount(() => db.select({ count: count() }).from(schema.calls).where(isNull(schema.calls.deletedAt))),
    safeCount(() => db.select({ count: count() }).from(schema.patients).where(isNull(schema.patients.deletedAt))),
    safeCount(() => db.select({ count: count() }).from(schema.appointments).where(isNull(schema.appointments.deletedAt))),
    safeCount(() => db.select({ count: count() }).from(schema.webhookEvents).where(eq(schema.webhookEvents.status, 'failed'))),
  ]);

  let recentEvents: typeof schema.webhookEvents.$inferSelect[] = [];
  try {
    recentEvents = await db.select().from(schema.webhookEvents).orderBy(desc(schema.webhookEvents.createdAt)).limit(10);
  } catch { /* empty */ }

  const getValue = (r: PromiseSettledResult<number>) => r.status === 'fulfilled' ? r.value : 0;

  const stats = [
    { label: 'Total Workspaces', value: getValue(totalWorkspaces), href: '/admin/workspaces', color: '#6366f1' },
    { label: 'Total Calls', value: getValue(totalCalls), href: '/admin/webhooks', color: '#22c55e' },
    { label: 'Total Patients', value: getValue(totalPatients), href: '#', color: '#f59e0b' },
    { label: 'Total Appointments', value: getValue(totalAppointments), href: '#', color: '#06b6d4' },
    { label: 'Failed Webhooks', value: getValue(failedWebhooks), href: '/admin/webhooks', color: '#ef4444' },
  ];

  const statusColor: Record<string, string> = {
    processed: '#22c55e',
    failed: '#ef4444',
    pending: '#f59e0b',
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-[#71717a] text-sm mt-1">Noryvex internal operations overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block bg-[#111111] border border-[#222222] rounded-xl p-6 hover:border-[#333333] transition-colors"
          >
            <div className="text-[#a1a1aa] text-sm">{stat.label}</div>
            <div className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Nav */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Quick Access</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Clients', href: '/admin/clients' },
            { label: 'Workspaces', href: '/admin/workspaces' },
            { label: 'Vapi Config', href: '/admin/vapi' },
            { label: 'Webhooks', href: '/admin/webhooks' },
            { label: 'Submissions', href: '/admin/submissions' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#222222] rounded-lg text-white text-sm hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Webhook Events */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Recent Webhook Events</h2>
        <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#222222]">
              <tr>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Type</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Call ID</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Attempts</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#71717a]">No webhook events yet</td>
                </tr>
              ) : (
                recentEvents.map((event) => (
                  <tr key={event.id} className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3 text-white font-mono text-xs">{event.eventType}</td>
                    <td className="px-4 py-3 text-[#a1a1aa] font-mono text-xs">
                      {event.vapiCallId ? event.vapiCallId.slice(0, 12) + '...' : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: (statusColor[event.status ?? 'pending'] ?? '#f59e0b') + '33',
                          color: statusColor[event.status ?? 'pending'] ?? '#f59e0b',
                        }}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{event.attempts}</td>
                    <td className="px-4 py-3 text-[#71717a] text-xs">
                      {event.createdAt ? new Date(event.createdAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
