import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, isNull, sql } from 'drizzle-orm';
import ClientModal from './ClientModal';

export default async function AdminClientsPage() {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  // Fetch all client_owner users with their workspace names
  const clients = await db
    .select({
      id: schema.users.id,
      fullName: schema.users.fullName,
      email: schema.users.email,
      createdAt: schema.users.createdAt,
      workspaceId: schema.workspaceMembers.workspaceId,
      workspaceName: schema.workspaces.name,
      workspaceStatus: schema.workspaces.status,
    })
    .from(schema.users)
    .leftJoin(schema.workspaceMembers, eq(schema.workspaceMembers.userId, schema.users.id))
    .leftJoin(schema.workspaces, eq(schema.workspaces.id, schema.workspaceMembers.workspaceId))
    .where(eq(schema.users.role, 'client_owner'))
    .orderBy(sql`${schema.users.createdAt} desc`);

  // Fetch available workspaces for the create form
  const availableWorkspaces = await db
    .select({ id: schema.workspaces.id, name: schema.workspaces.name, subdomain: schema.workspaces.subdomain })
    .from(schema.workspaces)
    .where(isNull(schema.workspaces.deletedAt))
    .orderBy(schema.workspaces.name);

  const statusColor: Record<string, string> = {
    active: '#22c55e',
    suspended: '#f59e0b',
    cancelled: '#ef4444',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Management</h1>
          <p className="text-[#71717a] text-sm mt-1">{clients.length} client{clients.length !== 1 ? 's' : ''} registered</p>
        </div>
        <ClientModal workspaces={availableWorkspaces} />
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#222222]">
            <tr>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Name</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Email</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Workspace</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Status</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#71717a]">
                  No clients yet. Create your first client.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{client.fullName}</td>
                  <td className="px-4 py-3 text-[#a1a1aa]">{client.email}</td>
                  <td className="px-4 py-3 text-[#a1a1aa]">
                    {client.workspaceName ?? (
                      <span className="text-[#71717a] italic">No workspace</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {client.workspaceStatus ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: (statusColor[client.workspaceStatus] ?? '#6b7280') + '22',
                          color: statusColor[client.workspaceStatus] ?? '#6b7280',
                        }}
                      >
                        {client.workspaceStatus}
                      </span>
                    ) : (
                      <span className="text-[#71717a] text-xs italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#71717a] text-xs">
                    {client.createdAt ? new Date(client.createdAt ?? Date.now()).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
