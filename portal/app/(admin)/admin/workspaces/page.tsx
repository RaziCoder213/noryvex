import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { isNull, desc } from 'drizzle-orm';
import WorkspaceModal from './WorkspaceModal';

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-500/10', text: 'text-green-400' },
  suspended: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default async function AdminWorkspacesPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  let workspaces: typeof schema.workspaces.$inferSelect[] = [];
  try {
    workspaces = await db
      .select()
      .from(schema.workspaces)
      .where(isNull(schema.workspaces.deletedAt))
      .orderBy(desc(schema.workspaces.createdAt));
  } catch (e) {
    console.error('Workspaces fetch error:', e);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Workspaces</h1>
          <p className="text-[#71717a] text-sm mt-1">{workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}</p>
        </div>
        <WorkspaceModal />
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#222222]">
            <tr>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Name</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Portal URL</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Industry</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Status</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Timezone</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#71717a]">
                  No workspaces yet. Click &quot;New Workspace&quot; to create one.
                </td>
              </tr>
            ) : (
              workspaces.map((ws) => {
                const colors = statusColors[ws.status] ?? statusColors.active;
                return (
                  <tr key={ws.id} className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{ws.name}</td>
                    <td className="px-4 py-3 text-[#6366f1] font-mono text-xs">
                      <a
                        href={`https://${ws.subdomain}.trynoryvex.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {ws.subdomain}.trynoryvex.com
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#a1a1aa] capitalize">
                      {ws.industry.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {ws.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#71717a] text-xs">{ws.timezone}</td>
                    <td className="px-4 py-3 text-[#71717a] text-xs">
                      {ws.createdAt ? new Date(ws.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
