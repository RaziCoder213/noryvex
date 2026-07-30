import Link from 'next/link';

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab || 'contact';

  const data = [
    { id: 'sub_1', name: 'Alice Smith', email: 'alice@test.com', phone: '1234567890', message: 'Hello...', date: new Date() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Marketing Submissions</h1>
        <button className="bg-[#222222] hover:bg-[#333333] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Export CSV
        </button>
      </div>

      <div className="flex gap-6 border-b border-[#222222] pb-0">
        <Link 
          href="?tab=contact" 
          className={`text-sm font-medium pb-3 border-b-2 transition-colors ${tab === 'contact' ? 'text-[#6366f1] border-[#6366f1]' : 'text-gray-400 border-transparent hover:text-gray-300'}`}
        >
          Contact Inquiries
        </Link>
        <Link 
          href="?tab=meetings" 
          className={`text-sm font-medium pb-3 border-b-2 transition-colors ${tab === 'meetings' ? 'text-[#6366f1] border-[#6366f1]' : 'text-gray-400 border-transparent hover:text-gray-300'}`}
        >
          Meeting Bookings
        </Link>
        <Link 
          href="?tab=trials" 
          className={`text-sm font-medium pb-3 border-b-2 transition-colors ${tab === 'trials' ? 'text-[#6366f1] border-[#6366f1]' : 'text-gray-400 border-transparent hover:text-gray-300'}`}
        >
          Trial Requests
        </Link>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">{tab === 'contact' ? 'Phone' : tab === 'meetings' ? 'Company' : 'Business Name'}</th>
                <th className="px-6 py-4">{tab === 'contact' ? 'Message' : tab === 'meetings' ? 'Status' : 'Industry'}</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-[#222222] hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                  <td className="px-6 py-4">{row.email}</td>
                  <td className="px-6 py-4">{row.phone}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{row.message}</td>
                  <td className="px-6 py-4">{row.date.toLocaleDateString()}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No submissions found
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

