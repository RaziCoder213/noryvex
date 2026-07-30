import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { getServerSession } from '@/lib/session';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) redirect('/login');
  if (session.role !== 'client_owner') redirect('/login');

  // Fetch workspace name from DB
  let workspaceName = 'My Workspace';
  if (session.workspaceId) {
    const ws = await db
      .select({ name: schema.workspaces.name })
      .from(schema.workspaces)
      .where(eq(schema.workspaces.id, session.workspaceId))
      .limit(1);
    if (ws[0]?.name) workspaceName = ws[0].name;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-[#e4e4e7]">
      <Sidebar workspaceName={workspaceName} isAdmin={false} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Portal" workspaceName={workspaceName} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
