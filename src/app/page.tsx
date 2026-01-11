export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-6">
      <main className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
            🗳️ ระบบเลือกตั้ง
          </h1>
          <h2 className="text-3xl font-semibold text-slate-300 mb-2">
            นายกและสมาชิก อบต.ทำนบ
          </h2>
          <p className="text-slate-400 text-lg">
            Election Dashboard for Tambon Tham-nop
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Dashboard Card */}
          <a
            href="/dashboard"
            className="group bg-gradient-to-br from-pink-600 to-purple-600 p-8 rounded-3xl shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 hover:-rotate-1"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
            <p className="text-pink-100 mb-4">
              แสดงผลสรุปคะแนนแบบเรียลไทม์
            </p>
            <div className="text-sm text-pink-200">
              Live results with animations
            </div>
          </a>

          {/* Observer Input Card */}
          <a
            href="/input"
            className="group bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-3xl shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105 hover:rotate-1"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">ผู้สังเกตการณ์</h3>
            <p className="text-green-100 mb-4">
              บันทึกคะแนนจากหน่วยเลือกตั้ง
            </p>
            <div className="text-sm text-green-200">
              Mobile-first observer input
            </div>
          </a>
        </div>

        {/* Info Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-slate-300">
            ℹ️ ข้อมูลการเลือกตั้ง
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-400">
            <div>
              <div className="text-pink-400 font-semibold mb-2">🎀 ใบชมพู - นายก อบต.</div>
              <ul className="space-y-1 text-sm">
                <li>• ผู้สมัคร 2 คน</li>
                <li>• เบอร์ 1: ABC</li>
                <li>• เบอร์ 2: DEF</li>
              </ul>
            </div>
            <div>
              <div className="text-green-400 font-semibold mb-2">🌿 ใบเขียว - สมาชิก อบต.</div>
              <ul className="space-y-1 text-sm">
                <li>• 7 หมู่บ้าน</li>
                <li>• หมู่ละ 2 ผู้สมัคร</li>
                <li>• รวม 14 ผู้สมัคร</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
            Built with Next.js, Tailwind CSS, Supabase & Framer Motion
          </div>
        </div>
      </main>
    </div>
  );
}
