import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { knowledgeDocuments as knowledge_documents, workspaceMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Badge from "@/components/shared/Badge";
import { KnowledgeFormWrapper } from "./KnowledgeFormWrapper";

export const metadata = {
  title: "Knowledge Base",
};

export default async function KnowledgePage() {
  const session = await getServerSession();
  if (!session || !session.userId) redirect("/login");

  const userMemberships = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, session.userId))
    .limit(1);

  const workspaceId = userMemberships[0]?.workspaceId;
  if (!workspaceId) redirect("/login");

  const docs = await db
    .select()
    .from(knowledge_documents)
    .where(eq(knowledge_documents.workspaceId, workspaceId));

  const sections = {
    'FAQs': docs.filter(d => d.type === 'faq'),
    'Hours & Availability': docs.filter(d => d.type === 'hours'),
    'Services': docs.filter(d => d.type === 'service'),
    'Pricing': docs.filter(d => d.type === 'pricing'),
    'Insurance': docs.filter(d => d.type === 'insurance'),
    'Emergency': docs.filter(d => d.type === 'emergency'),
    'Documents': docs.filter(d => d.type === 'document'),
    'External Links': docs.filter(d => d.type === 'url'),
  };

  return (
    <div className="flex flex-col p-8 gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-gray-400 text-sm">Train your AI assistant with custom knowledge about your practice.</p>
        </div>
        <KnowledgeFormWrapper />
      </div>

      <div className="grid gap-8">
        {Object.entries(sections).map(([title, sectionDocs]) => (
          <div key={title} className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#222222] bg-[#0a0a0a] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <span className="text-xs text-gray-500">{sectionDocs.length} items</span>
            </div>
            <div className="p-0">
              {sectionDocs.length > 0 ? (
                <div className="divide-y divide-[#222222]">
                  {sectionDocs.map(doc => (
                    <div key={doc.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-white">{doc.title}</h3>
                          <Badge variant={doc.isActive ? 'success' : 'default'}>
                            {doc.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {doc.content && (
                          <p className="text-sm text-gray-400 line-clamp-2">{doc.content}</p>
                        )}
                        {doc.sourceUrl && (
                          <a href={doc.sourceUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                            {doc.sourceUrl}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="text-xs px-3 py-1.5 border border-[#222222] rounded text-gray-300 hover:bg-[#222222]">Edit</button>
                        <button className="text-xs px-3 py-1.5 border border-red-900/30 text-red-500 rounded hover:bg-red-900/20">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No documents in this section yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

