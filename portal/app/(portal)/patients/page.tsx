import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, ilike, or, and } from "drizzle-orm";
import Badge from "@/components/shared/Badge";

export const metadata = {
  title: "Patients",
};

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
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
  const statusFilter = params.status as schema.PatientStatus | undefined;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 25;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(schema.patients.workspaceId, workspaceId)];

  if (search) {
    conditions.push(
      or(
        ilike(schema.patients.name, `%${search}%`),
        ilike(schema.patients.phone, `%${search}%`),
        ilike(schema.patients.email, `%${search}%`)
      )!
    );
  }

  if (statusFilter) {
    conditions.push(eq(schema.patients.status, statusFilter));
  }

  const patientsList = await db
    .select()
    .from(schema.patients)
    .where(and(...conditions))
    .orderBy(desc(schema.patients.createdAt))
    .limit(pageSize)
    .offset(offset);

  const statusColors: Record<string, string> = {
    new: 'default',
    active: 'success',
    follow_up: 'warning',
    inactive: 'danger',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Patients</h1>
          <p className="text-[#71717a] text-sm mt-1">{patientsList.length} patients loaded</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name, phone, or email..."
          className="flex-1 bg-[#111111] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#6366f1] transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#6366f1] hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#222222]">
            <tr>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Name</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Phone</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Email</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Treatment</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Status</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium">Added</th>
            </tr>
          </thead>
          <tbody>
            {patientsList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#71717a]">
                  No patients found.
                </td>
              </tr>
            ) : (
              patientsList.map((patient) => (
                <tr key={patient.id} className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{patient.name}</td>
                  <td className="px-4 py-3 text-[#a1a1aa]">{patient.phone || '—'}</td>
                  <td className="px-4 py-3 text-[#a1a1aa]">{patient.email || '—'}</td>
                  <td className="px-4 py-3 text-[#a1a1aa]">{patient.treatmentRequested || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={(statusColors[patient.status ?? 'new'] as 'default' | 'success' | 'warning' | 'danger') ?? 'default'}>
                      {patient.status ?? 'new'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#71717a] text-xs">
                    {new Date(patient.createdAt ?? Date.now()).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#222222]">
          <p className="text-[#71717a] text-sm">Page {page}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/patients?${search ? `search=${search}&` : ''}page=${page - 1}`}
                className="px-3 py-1 text-sm bg-[#1a1a1a] border border-[#222222] rounded text-white hover:border-[#6366f1] transition-colors"
              >
                Previous
              </a>
            )}
            {patientsList.length === pageSize && (
              <a
                href={`/patients?${search ? `search=${search}&` : ''}page=${page + 1}`}
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
