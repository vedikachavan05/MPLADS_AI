
function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide">
              MPLADS <span className="text-blue-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400">
              Implementation Intelligence
            </p>
          </div>

          <nav className="flex gap-6 text-sm">
            <a href="#" className="font-semibold text-white">
              Dashboard
            </a>
            <a href="#" className="text-slate-300 hover:text-white">
              About
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-bold">
          MPLADS Implementation Intelligence
        </h2>
        
<div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {[
    { title: "Total Records", value: "1,110", note: "Illustrative data" },
    { title: "17th Lok Sabha", value: "557", note: "Illustrative data" },
    { title: "18th Lok Sabha", value: "553", note: "Illustrative data" },
    { title: "Potential Anomalies", value: "—", note: "Detection not connected" },
  ].map((item) => (
    <div
      key={item.title}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <p className="text-sm font-medium text-slate-500">
        {item.title}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {item.value}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        {item.note}
      </p>
    </div>
  ))}
</div>

<div className="mt-10">
  <h3 className="text-lg font-bold text-slate-800">
    Key Performance Indicators
  </h3>
  <p className="mt-1 text-sm text-slate-500">
    Financial and implementation overview
  </p>
</div>

<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
  {[
    {
      title: "Fund Utilisation Rate",
      description: "Expenditure against allocation",
      color: "border-l-blue-500",
    },
    {
      title: "Sanction Rate",
      description: "Sanctioned against recommended",
      color: "border-l-violet-500",
    },
    {
      title: "Work Completion Rate",
      description: "Completed against sanctioned works",
      color: "border-l-emerald-500",
    },
  ].map((item) => (
    <div
      key={item.title}
      className={`rounded-xl border border-slate-200 border-l-4 ${item.color} bg-white p-5 shadow-sm`}
    >
      <p className="text-sm font-medium text-slate-500">
        {item.title}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        --
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Waiting for backend data
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {item.description}
      </p>
    </div>
  ))}
</div>
<div className="mt-10">
  <h3 className="text-lg font-bold text-slate-800">
    Anomaly Alerts
  </h3>
  <p className="mt-1 text-sm text-slate-500">
    Records flagged for further investigation
  </p>
</div>
<div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
  <div className="border-b border-slate-200 px-5 py-4">
    <h4 className="font-semibold text-slate-800">
      Flagged Records
    </h4>
    <p className="mt-1 text-sm text-slate-500">
      Example layout — detection data not connected
    </p>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-500">
        <tr>
          <th className="px-5 py-3 font-medium">Record</th>
          <th className="px-5 py-3 font-medium">Indicator</th>
          <th className="px-5 py-3 font-medium">Risk</th>
          <th className="px-5 py-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <tr>
          <td className="px-5 py-4 font-medium text-slate-800">
            Sample record 01
          </td>
          <td className="px-5 py-4 text-slate-600">
            Unusual utilisation pattern
          </td>
          <td className="px-5 py-4">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Review
            </span>
          </td>
          <td className="px-5 py-4 text-slate-500">
            Pending
          </td>
        </tr>
        <tr>
          <td className="px-5 py-4 font-medium text-slate-800">
            Sample record 02
          </td>
          <td className="px-5 py-4 text-slate-600">
            Unusual sanction pattern
          </td>
          <td className="px-5 py-4">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Review
            </span>
          </td>
          <td className="px-5 py-4 text-slate-500">
            Pending
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
      </main>
    </div>
  );
}

export default App;