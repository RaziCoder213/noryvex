import VapiModal from './VapiModal';

export default async function AdminVapiPage() {
  const configs = [
    { workspaceId: 'ws_1', workspaceName: 'Doe Dental', vapiId: 'vapi_abc', voiceId: 'voice_123', model: 'gpt-4o', phone: '+1234567890', status: 'active' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Vapi Configurations</h1>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-4">Workspace</th>
                <th className="px-6 py-4">Vapi ID</th>
                <th className="px-6 py-4">Voice ID</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((conf) => (
                <tr key={conf.workspaceId} className="border-b border-[#222222] hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{conf.workspaceName}</td>
                  <td className="px-6 py-4">{conf.vapiId}</td>
                  <td className="px-6 py-4">{conf.voiceId}</td>
                  <td className="px-6 py-4">{conf.model}</td>
                  <td className="px-6 py-4">{conf.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">{conf.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <VapiModal workspaceId={conf.workspaceId} existing={conf} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

