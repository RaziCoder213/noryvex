import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { calls, appointments, patients, workspaceMembers } from "@/lib/db/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import StatCard from "@/components/shared/StatCard";
import DataTable from "@/components/shared/DataTable";
import Badge from "@/components/shared/Badge";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session || !session.userId) {
    redirect("/login");
  }

  const userMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = userMemberships[0]?.workspaceId;

  if (!workspaceId) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const todayCalls = await db
    .select()
    .from(calls)
    .where(
      and(
        eq(calls.workspaceId, workspaceId),
        gte(calls.createdAt, today)
      )
    );

  const answeredCalls = todayCalls.filter(c => c.outcome === "answered").length;
  const missedCalls = todayCalls.filter(c => c.outcome === "missed").length;
  const totalCalls = todayCalls.length;

  const upcomingApptsQuery = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(
      and(
        eq(appointments.workspaceId, workspaceId),
        gte(appointments.startTime, new Date())
      )
    );
  const upcomingApptsCount = upcomingApptsQuery[0]?.count || 0;

  const newPatientsQuery = await db
    .select({ count: sql<number>`count(*)` })
    .from(patients)
    .where(
      and(
        eq(patients.workspaceId, workspaceId),
        gte(patients.createdAt, startOfWeek)
      )
    );
  const newPatientsCount = newPatientsQuery[0]?.count || 0;

  const recentCalls = await db
    .select()
    .from(calls)
    .where(eq(calls.workspaceId, workspaceId))
    .orderBy(desc(calls.createdAt))
    .limit(10);

  const upcomingAppts = await db
    .select({
      id: appointments.id,
      service: appointments.service,
      startTime: appointments.startTime,
      status: appointments.status,
      patient_name: patients.name,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(
      and(
        eq(appointments.workspaceId, workspaceId),
        gte(appointments.startTime, new Date())
      )
    )
    .orderBy(appointments.startTime)
    .limit(5);

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Calls (Today)" value={totalCalls} />
        <StatCard title="Answered" value={answeredCalls} />
        <StatCard title="Missed" value={missedCalls} />
        <StatCard title="Upcoming Appointments" value={upcomingApptsCount} />
        <StatCard title="New Patients (This Week)" value={newPatientsCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Calls</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-[#0a0a0a] text-gray-500 border-b border-[#222222]">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Caller</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map(call => (
                  <tr key={call.id} className="border-b border-[#222222]">
                    <td className="px-4 py-3">{new Date(call.createdAt ?? Date.now()).toLocaleTimeString()}</td>
                    <td className="px-4 py-3">{call.callerName || call.callerPhone}</td>
                    <td className="px-4 py-3">{call.durationSeconds}s</td>
                    <td className="px-4 py-3">
                      <Badge variant={call.outcome === 'answered' ? 'success' : 'danger'}>
                        {call.outcome}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{call.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h2>
          <div className="flex flex-col gap-4">
            {upcomingAppts.map(appt => (
              <div key={appt.id} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#222222]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">{appt.patient_name}</span>
                  <Badge variant="default">{appt.status}</Badge>
                </div>
                <div className="text-sm text-gray-400 mb-1">{appt.service}</div>
                <div className="text-xs text-gray-500">{new Date(appt.startTime ?? Date.now()).toLocaleString()}</div>
              </div>
            ))}
            {upcomingAppts.length === 0 && (
              <div className="text-gray-500 text-sm">No upcoming appointments.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

