export default function Dashboard() {
  return (
    <div className="min-h-screen bg-offwhite text-charcoal flex max-md:hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-charcoal bg-offwhite flex flex-col">
        <div className="p-6 border-b-2 border-charcoal bg-charcoal text-offwhite">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-widest leading-none">
            Gantavya
          </h1>
          <p className="font-mono text-xs uppercase mt-2 opacity-80">Command Center</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <a href="#" className="font-bold uppercase p-3 bg-charcoal text-offwhite border-2 border-charcoal">Overview</a>
          <a href="#" className="font-bold uppercase p-3 border-2 border-charcoal hover:bg-charcoal hover:text-offwhite transition-colors">Nodes</a>
          <a href="#" className="font-bold uppercase p-3 border-2 border-charcoal hover:bg-charcoal hover:text-offwhite transition-colors">Violations</a>
          <a href="#" className="font-bold uppercase p-3 border-2 border-charcoal hover:bg-charcoal hover:text-offwhite transition-colors">Fleet</a>
        </nav>
        <div className="p-4 border-t-2 border-charcoal font-mono text-sm uppercase">
          Sys Status: <span className="font-bold text-green-700">Online</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="border-b-2 border-charcoal p-6 flex justify-between items-center">
          <h2 className="font-bold text-3xl uppercase tracking-wider">Live Telemetry</h2>
          <div className="font-mono tabular-nums text-xl font-bold">
            18:50:15 IST
          </div>
        </header>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* Mock Heatmap */}
          <section className="border-2 border-charcoal">
            <div className="border-b-2 border-charcoal p-3 bg-charcoal text-offwhite">
              <h3 className="font-bold uppercase tracking-widest text-sm">Distributed Micro-Stands (Heatmap)</h3>
            </div>
            {/* Grid-based heatmap with blocky colors */}
            <div className="grid grid-cols-5 grid-rows-3 gap-0 h-64 bg-offwhite p-4">
              <div className="bg-charcoal bg-opacity-10 border-2 border-transparent"></div>
              <div className="bg-warning border-2 border-charcoal"></div>
              <div className="bg-charcoal bg-opacity-10 border-2 border-transparent"></div>
              <div className="bg-violation border-2 border-charcoal relative flex items-center justify-center">
                <span className="font-mono font-bold text-offwhite z-10">M-01</span>
              </div>
              <div className="bg-charcoal bg-opacity-20 border-2 border-transparent"></div>
              
              <div className="bg-warning border-2 border-charcoal"></div>
              <div className="bg-charcoal bg-opacity-20 border-2 border-transparent"></div>
              <div className="bg-warning border-2 border-charcoal relative flex items-center justify-center">
                <span className="font-mono font-bold text-charcoal z-10">M-05</span>
              </div>
              <div className="bg-charcoal bg-opacity-10 border-2 border-transparent"></div>
              <div className="bg-charcoal bg-opacity-10 border-2 border-transparent"></div>
              
              <div className="bg-charcoal bg-opacity-10 border-2 border-transparent"></div>
              <div className="bg-charcoal bg-opacity-20 border-2 border-transparent"></div>
              <div className="bg-violation border-2 border-charcoal relative flex items-center justify-center">
                <span className="font-mono font-bold text-offwhite z-10">M-14</span>
              </div>
              <div className="bg-warning border-2 border-charcoal"></div>
              <div className="bg-charcoal bg-opacity-10 border-2 border-transparent"></div>
            </div>
            <div className="border-t-2 border-charcoal p-3 flex gap-4 text-xs font-mono uppercase font-bold">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-violation border border-charcoal"></div> Critical Load</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-warning border border-charcoal"></div> High Load</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-charcoal bg-opacity-20 border border-charcoal"></div> Normal</span>
            </div>
          </section>

          {/* Data Table */}
          <section className="border-2 border-charcoal flex-1">
            <div className="border-b-2 border-charcoal p-3 bg-charcoal text-offwhite">
              <h3 className="font-bold uppercase tracking-widest text-sm">System Logs: Loitering & Load Balancing</h3>
            </div>
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b-2 border-charcoal">
                  <th className="p-3 font-bold uppercase">Node ID</th>
                  <th className="p-3 font-bold uppercase">Location</th>
                  <th className="p-3 font-bold uppercase">Status</th>
                  <th className="p-3 font-bold uppercase text-right">Passenger Count</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-charcoal border-opacity-30">
                  <td className="p-3">M-01</td>
                  <td className="p-3">Kamta Intersection (Service Lane)</td>
                  <td className="p-3">
                    <span className="inline-block bg-violation text-offwhite font-bold px-2 py-1 uppercase text-xs border border-charcoal">
                      LIVE LOITERING VIOLATION
                    </span>
                  </td>
                  <td className="p-3 text-right tabular-nums">42 / 10</td>
                </tr>
                <tr className="border-b border-charcoal border-opacity-30">
                  <td className="p-3">M-14</td>
                  <td className="p-3">Polytechnic (Gate 2)</td>
                  <td className="p-3">
                    <span className="inline-block bg-warning text-charcoal font-bold px-2 py-1 uppercase text-xs border border-charcoal">
                      HIGH LOAD REBALANCING
                    </span>
                  </td>
                  <td className="p-3 text-right tabular-nums">18 / 15</td>
                </tr>
                <tr className="border-b border-charcoal border-opacity-30">
                  <td className="p-3">M-05</td>
                  <td className="p-3">Chinhat Bypass Zone</td>
                  <td className="p-3">
                    <span className="inline-block text-charcoal font-bold px-2 py-1 uppercase text-xs">
                      NORMAL
                    </span>
                  </td>
                  <td className="p-3 text-right tabular-nums">4 / 15</td>
                </tr>
              </tbody>
            </table>
          </section>

        </div>
      </main>

      {/* Mobile view warning (hidden on desktop) */}
      <div className="hidden max-md:flex min-h-screen bg-charcoal text-offwhite items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-bold text-2xl uppercase mb-4">Desktop View Required</h1>
          <p className="font-mono">The command center is restricted to desktop resolutions.</p>
        </div>
      </div>
    </div>
  );
}
