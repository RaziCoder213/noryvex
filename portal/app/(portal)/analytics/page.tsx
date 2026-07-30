import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { calls, workspaceMembers } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import StatCard from "@/components/shared/StatCard";
import { CallVolumeChart } from "./CallVolumeChart";
import { SentimentChart } from "./SentimentChart";

export const metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const session = await getServerSession();
  if (!session || !session.userId) redirect("/login");

  const userMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = userMemberships[0]?.workspaceId;
  if (!workspaceId) redirect("/login");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const recentCalls = await db
    .select()
    .from(calls)
    .where(
      and(
        eq(calls.workspaceId, workspaceId),
        gte(calls.createdAt, thirtyDaysAgo)
      )
    );

  const totalCalls = recentCalls.length;
  const answeredCalls = recentCalls.filter(c => c.outcome === 'answered').length;
  const missedCalls = recentCalls.filter(c => c.outcome === 'missed').length;
  
  const totalDuration = recentCalls.reduce((sum, call) => sum + (call.durationSeconds ?? 0), 0);
  const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;

  
  const conversions = recentCalls.filter(c => c.appointmentCreated).length;
  const conversionRate = totalCalls > 0 ? Math.round((conversions / totalCalls) * 100) : 0;
  const answeredRate = totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0;

  // Aggregate by date for chart
  const dailyDataMap = new Map();
  
  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dailyDataMap.set(dateStr, { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), answered: 0, missed: 0 });
  }

  // Populate actual data
  recentCalls.forEach(call => {
    if (!call.createdAt) return;
    const dateStr = new Date(call.createdAt ?? Date.now()).toISOString().split('T')[0];
    if (dailyDataMap.has(dateStr)) {
      const data = dailyDataMap.get(dateStr)!;
      if (call.outcome === 'answered') data.answered++;
      else if (call.outcome === 'missed') data.missed++;
    }
  });


  const chartData = Array.from(dailyDataMap.values());

  // Sentiment data
  const sentiments = { Positive: 0, Neutral: 0, Negative: 0, Unknown: 0 };
  recentCalls.forEach(call => {
    const s = call.sentiment?.toLowerCase() || 'unknown';
    if (s.includes('positive')) sentiments.Positive++;
    else if (s.includes('negative')) sentiments.Negative++;
    else if (s.includes('neutral')) sentiments.Neutral++;
    else sentiments.Unknown++;
  });

  const sentimentData = [
    { name: 'Positive', value: sentiments.Positive },
    { name: 'Neutral', value: sentiments.Neutral },
    { name: 'Negative', value: sentiments.Negative },
    { name: 'Unknown', value: sentiments.Unknown }
  ].filter(d => d.value > 0);

  return (
    <div className="flex flex-col p-8 gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400 text-sm">Overview of your call volume and AI performance over the last 30 days.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Calls" value={totalCalls} />
        <StatCard title="Answered Rate" value={`${answeredRate}%`} />
        <StatCard title="Avg Duration" value={`${avgDuration}s`} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} />
        <StatCard title="Missed Calls" value={missedCalls} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Call Volume (30 Days)</h2>
          <CallVolumeChart data={chartData} />
        </div>
        
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Sentiment Analysis</h2>
          {sentimentData.length > 0 ? (
            <SentimentChart data={sentimentData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Not enough data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

