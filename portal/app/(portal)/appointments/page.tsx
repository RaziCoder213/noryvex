import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { appointments, patients, workspaceMembers } from "@/lib/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import Badge from "@/components/shared/Badge";

export const metadata = {
  title: "Appointments",
};

interface AppointmentsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const session = await getServerSession();
  if (!session || !session.userId) redirect("/login");

  const userMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = userMemberships[0]?.workspaceId;
  if (!workspaceId) redirect("/login");

  const params = await searchParams;
  const statusFilter = params.status || "upcoming";

  const conditions = [eq(appointments.workspaceId, workspaceId)];

  if (statusFilter === "upcoming") {
    conditions.push(sql`${appointments.startTime} > now()`);
    conditions.push(eq(appointments.status, 'upcoming'));
  } else if (statusFilter === "completed") {
    conditions.push(eq(appointments.status, 'completed'));
  } else if (statusFilter === "cancelled") {
    conditions.push(eq(appointments.status, 'cancelled'));
  }

  const appointmentsList = await db
    .select({
      id: appointments.id,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      service: appointments.service,
      status: appointments.status,
      notes: appointments.notes,
      patient_name: patients.name,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(...conditions))
    .orderBy(asc(appointments.startTime));

  return (
    <div className="flex flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Appointments</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <Link 
          href="?status=upcoming" 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'upcoming' ? 'bg-[#222222] text-white' : 'text-gray-400 hover:bg-[#111111]'}`}
        >
          Upcoming
        </Link>
        <Link 
          href="?status=completed" 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'completed' ? 'bg-[#222222] text-white' : 'text-gray-400 hover:bg-[#111111]'}`}
        >
          Completed
        </Link>
        <Link 
          href="?status=cancelled" 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'cancelled' ? 'bg-[#222222] text-white' : 'text-gray-400 hover:bg-[#111111]'}`}
        >
          Cancelled
        </Link>
        <Link 
          href="?status=all" 
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-[#222222] text-white' : 'text-gray-400 hover:bg-[#111111]'}`}
        >
          All
        </Link>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-[#0a0a0a] text-gray-500 border-b border-[#222222]">
              <tr>
                <th className="px-4 py-4">Date/Time</th>
                <th className="px-4 py-4">Patient Name</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Booked By</th>
                <th className="px-4 py-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsList.map(appt => (
                <tr key={appt.id} className="border-b border-[#222222] hover:bg-[#1a1a1a]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(appt.startTime ?? Date.now()).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{appt.patient_name || 'Unknown'}</td>
                  <td className="px-4 py-3">{appt.service}</td>
                  <td className="px-4 py-3">
                    <Badge variant={appt.status === 'upcoming' ? 'success' : appt.status === 'cancelled' ? 'danger' : appt.status === 'completed' ? 'info' : 'default'}>
                      {appt.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default">AI Assistant</Badge>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate" title={appt.notes || ''}>
                    {appt.notes || '-'}
                  </td>
                </tr>
              ))}
              {appointmentsList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

