import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./SettingsForm";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session || !session.userId) redirect("/login");

  const userMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = userMemberships[0]?.workspaceId;
  if (!workspaceId) redirect("/login");

  const userRec = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const workspaceRec = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  const user = userRec[0];
  const workspace = workspaceRec[0];

  return (
    <div className="flex flex-col p-8 gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your personal profile and view workspace details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SettingsForm user={{ name: user.fullName || '', email: user.email }} />
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Workspace Details</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="block text-gray-500 mb-1">Workspace Name</span>
                <span className="text-white font-medium">{workspace?.name || 'Unknown Workspace'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Industry</span>
                <span className="text-white font-medium capitalize">{workspace?.industry || 'Not Specified'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Timezone</span>
                <span className="text-white font-medium">{workspace?.timezone || 'UTC'}</span>
              </div>
              <div className="pt-4 border-t border-[#222222]">
                <p className="text-xs text-gray-500">
                  Workspace settings can only be modified by the workspace owner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

