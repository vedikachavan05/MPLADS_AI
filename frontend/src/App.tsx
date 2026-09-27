
import { useEffect, useState } from "react";
function App() {
    const [overview, setOverview] = useState<any>(null);
    const [kpis, setKpis] = useState<any>(null);
    const [anomalies, setAnomalies] = useState<any[]>([]);
    const [riskFilter, setRiskFilter] = useState("All");
    const [lokSabhaFilter, setLokSabhaFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
      useEffect(() => {
    fetch("http://127.0.0.1:5000/api/overview")
      .then((response) => response.json())
      .then((data) => {
  console.log("Backend data:", data);
  setOverview(data);
})
      .catch((error) => {
        console.error("Error fetching overview:", error);
      });
  }, []);
    useEffect(() => {
    fetch("http://127.0.0.1:5000/api/kpis")
      .then((response) => response.json())
      .then((data) => {
        console.log("KPI data:", data);
        setKpis(data);
      })
      .catch((error) => {
        console.error("Error fetching KPIs:", error);
      });
  }, []);
    useEffect(() => {
  fetch("http://127.0.0.1:5000/api/anomalies")
    .then((response) => response.json())
    .then((data) => {
      console.log("First anomaly JSON:", JSON.stringify(data[0], null, 2));
      setAnomalies(data);
    })
    .catch((error) => {
      console.error("Error fetching anomalies:", error);
    });
}, []);
  // GET RISK LEVEL
const getRiskLevel = (score: number) => {
  const numericScore = Number(score);

  if (numericScore < -0.2) {
    return "High";
  } else if (numericScore < -0.1) {
    return "Medium";
  } else {
    return "Low";
  }
};

// FILTER ANOMALIES
const filteredAnomalies = anomalies.filter((anomaly) => {

  const risk = getRiskLevel(anomaly.anomaly_score);

  const matchesRisk =
    riskFilter === "All" || risk === riskFilter;

  const lokSabha = String(anomaly.lok_sabha).toLowerCase();

  const matchesLokSabha =
    lokSabhaFilter === "All" ||
    lokSabha.includes(lokSabhaFilter.toLowerCase());

  return matchesRisk && matchesLokSabha;
});
// PAGINATION
const itemsPerPage = 10;

const totalPages = Math.ceil(
  filteredAnomalies.length / itemsPerPage
);

const startIndex = (currentPage - 1) * itemsPerPage;

const paginatedAnomalies = filteredAnomalies.slice(
  startIndex,
  startIndex + itemsPerPage
);

// Reset page when filter changes
useEffect(() => {
  setCurrentPage(1);
}, [riskFilter, lokSabhaFilter]);
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
    { title: "Total Records", value: overview ? overview.total_records.toLocaleString() : "...", note: "From backend" },
    { title: "17th Lok Sabha", value: overview ? overview["17th_lok_sabha"].toLocaleString() : "...", note: "From backend" },
    { title: "18th Lok Sabha", value: overview ? overview["18th_lok_sabha"].toLocaleString() : "...", note: "From backend" },
    { title: "Potential Anomalies", value: overview ? overview.potential_anomalies.toLocaleString() : "...", note: "From ML detection" },
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
      value: "fund_utilization",
    },
   {
  title: "Sanction Rate",
  description: "Sanctioned against recommended",
  color: "border-l-violet-500",
  value: "sanction_rate",
},
  {
  title: "Work Completion Rate",
  description: "Completed against sanctioned works",
  color: "border-l-emerald-500",
  value: "work_completion_rate",
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
        {kpis ? `${kpis["17th_lok_sabha"][item.value]}%` : "..."}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        from backend
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
    {/* FILTERS */}
<div className="flex flex-wrap gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">

  {/* RISK FILTER */}
  <div>
    <label className="mb-1 block text-xs font-semibold text-slate-600">
      Risk Level
    </label>

    <select
      value={riskFilter}
      onChange={(e) => setRiskFilter(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
    >
      <option value="All">All</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  </div>

  {/* LOK SABHA FILTER */}
  <div>
    <label className="mb-1 block text-xs font-semibold text-slate-600">
      Lok Sabha
    </label>

    <select
      value={lokSabhaFilter}
      onChange={(e) => setLokSabhaFilter(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
    >
      <option value="All">All</option>
      <option value="17th">17th</option>
      <option value="18th">18th</option>
    </select>
  </div>

</div>
    <h4 className="font-semibold text-slate-800">
      Flagged Records
    </h4>
    <p className="mt-1 text-sm text-slate-500">
      ML-detected records requiring verification
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
  {paginatedAnomalies.map((anomaly, index)  => (
    <tr key={index}>
      <td className="px-5 py-4 font-medium text-slate-800">
        {anomaly.constituency_name}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {anomaly.anomaly_reason}
      </td>

      <td className="px-5 py-4">
        <span className="rounded-full  px-3 py-1 text-xs font-semibold text-amber-700">
        <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    getRiskLevel(anomaly.anomaly_score) === "High"
      ? "bg-red-100 text-red-700"
      : getRiskLevel(anomaly.anomaly_score) === "Medium"
      ? "bg-orange-100 text-orange-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {getRiskLevel(anomaly.anomaly_score)}
</span>
        </span>
      </td>

      <td className="px-5 py-4 text-slate-500">
        {anomaly.lok_sabha}
      </td>
    </tr>
  ))}
</tbody>
    </table>

  </div>
  {/* PAGINATION */}
{totalPages > 1 && (
  <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

    <button
      onClick={() =>
        setCurrentPage((page) => page - 1)
      }
      disabled={currentPage === 1}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    <span className="text-sm text-slate-500">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() =>
        setCurrentPage((page) => page + 1)
      }
      disabled={currentPage === totalPages}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>

  </div>
)}
</div>
      </main>
    </div>
  );
}

export default App;