export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            NORY<span className="text-indigo-500">VEX</span>
          </h1>
          <p className="text-[#71717a] text-sm mt-1">Client Portal</p>
        </div>
        {children}
      </div>
    </div>
  );
}

