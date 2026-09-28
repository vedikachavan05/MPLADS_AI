import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [activePage, setActivePage] = useState("overview");

  const [overview, setOverview] = useState<any>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [mpData, setMpData] = useState<any[]>([]);

  const [riskFilter, setRiskFilter] = useState("All");
  const [lokSabhaFilter, setLokSabhaFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [mpSearch, setMpSearch] = useState("");
  const [mpSignalFilter, setMpSignalFilter] = useState("All");
  const [selectedMP, setSelectedMP] = useState<any>(null);

  // MP pagination
  const [mpCurrentPage, setMpCurrentPage] = useState(1);

  const mpFinancialPieData = [
    {
      name: "Expenditure",
      value: 39953382732.14,
    },
    {
      name: "Remaining Allocation",
      value: 116819035627.53 - 39953382732.14,
    },
  ];

  // =========================
  // OVERVIEW DATA
  // =========================

  useEffect(() => {
    fetch("https://mplads-ai-jovn.onrender.com/api/overview")
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
    fetch("https://mplads-ai-jovn.onrender.com/api/kpis")
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
    fetch("https://mplads-ai-jovn.onrender.com/api/anomalies")
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "First anomaly JSON:",
          JSON.stringify(data[0], null, 2)
        );
        setAnomalies(data);
      })
      .catch((error) => {
        console.error("Error fetching anomalies:", error);
      });
  }, []);

  // =========================
  // MP INTELLIGENCE DATA
  // =========================

  useEffect(() => {
    fetch("https://mplads-ai-jovn.onrender.com/api/mp-intelligence")
      .then((response) => response.json())
      .then((data) => {
        console.log("MP Intelligence data:", data);
        setMpData(data);
      })
      .catch((error) => {
        console.error("Error fetching MP Intelligence:", error);
      });
  }, []);

  // =========================
  // OVERVIEW ANOMALY LOGIC
  // =========================

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

  const itemsPerPage = 10;

  const totalPages = Math.ceil(
    filteredAnomalies.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedAnomalies = filteredAnomalies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [riskFilter, lokSabhaFilter]);

  // =========================
  // MP INTELLIGENCE LOGIC
  // =========================

  const totalMPs = mpData.length;

  const MPsWithSignals = mpData.filter(
    (mp) => mp.overall_signal === true
  ).length;

  const MPsWithoutSignals =
    totalMPs - MPsWithSignals;

  const statisticalSignals = mpData.filter(
    (mp) =>
      Number(mp.statistical_signal_count) > 0
  ).length;

  const mlSignals = mpData.filter(
    (mp) => mp.ml_anomaly_signal === true
  ).length;

  const filteredMPs = mpData.filter((mp) => {
    const searchText = mpSearch.toLowerCase();

    const matchesSearch =
      String(mp["MP Name"])
        .toLowerCase()
        .includes(searchText) ||
      String(mp["Constituency"])
        .toLowerCase()
        .includes(searchText) ||
      String(mp["State"])
        .toLowerCase()
        .includes(searchText);

    const hasSignal = mp.overall_signal === true;

    const matchesSignal =
      mpSignalFilter === "All" ||
      (mpSignalFilter === "Signal" && hasSignal) ||
      (mpSignalFilter === "No Signal" && !hasSignal);

    return matchesSearch && matchesSignal;
  });

  // =========================
  // MP PAGINATION
  // =========================

  const mpItemsPerPage = 10;

  const mpTotalPages = Math.ceil(
    filteredMPs.length / mpItemsPerPage
  );

  const mpStartIndex =
    (mpCurrentPage - 1) * mpItemsPerPage;

  const paginatedMPs = filteredMPs.slice(
    mpStartIndex,
    mpStartIndex + mpItemsPerPage
  );

  useEffect(() => {
    setMpCurrentPage(1);
  }, [mpSearch, mpSignalFilter]);

  // =========================
  // MP DETAIL
  // =========================

  const openMPDetails = (mp: any) => {
    setSelectedMP(mp);
  };

  const closeMPDetails = () => {
    setSelectedMP(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* =========================
          HEADER
      ========================= */}

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

          <nav className="flex flex-wrap gap-6 text-sm">

            <button
              onClick={() => {
                setActivePage("overview");
                setSelectedMP(null);
              }}
              className={
                activePage === "overview"
                  ? "font-semibold text-white"
                  : "text-slate-300 hover:text-white"
              }
            >
              Overview
            </button>

            <button
              onClick={() => {
                setActivePage("mp-intelligence");
                setSelectedMP(null);
              }}
              className={
                activePage === "mp-intelligence"
                  ? "font-semibold text-white"
                  : "text-slate-300 hover:text-white"
              }
            >
              MP Intelligence
            </button>

            <button
              onClick={() =>
                setActivePage("work-intelligence")
              }
              className={
                activePage === "work-intelligence"
                  ? "font-semibold text-white"
                  : "text-slate-300 hover:text-white"
              }
            >
              Work Intelligence
            </button>

            <button
              onClick={() =>
                setActivePage("payment-intelligence")
              }
              className={
                activePage === "payment-intelligence"
                  ? "font-semibold text-white"
                  : "text-slate-300 hover:text-white"
              }
            >
              Payment Intelligence
            </button>

          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* =====================================================
            MP DETAIL PAGE
        ====================================================== */}

        {activePage === "mp-intelligence" && selectedMP && (
          <div>

            <button
              onClick={closeMPDetails}
              className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back to MP Intelligence
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                {selectedMP["MP Name"]}
              </h2>

              <p className="mt-2 text-slate-500">
                {selectedMP["Constituency"]} ·{" "}
                {selectedMP["State"]} ·{" "}
                {selectedMP["House"]}
              </p>
            </div>

            {/* RISK INVESTIGATION */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-wrap items-start justify-between gap-4">

                <div>
                  <h3 className="text-lg font-bold">
                    Investigation Summary
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    System-generated risk indicators for further review
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedMP.overall_signal
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedMP.overall_signal
                    ? "Risk Detected"
                    : "No Current Risk"}
                </span>

              </div>

              {/* WHY FLAGGED */}

              <div className="mt-6">

                <h4 className="font-semibold text-slate-800">
                  Why Flagged
                </h4>

                <div className="mt-3 space-y-2">

                  {selectedMP.statistical_reason ? (
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">

                      <span className="font-medium">
                        Statistical risk:
                      </span>{" "}

                      {selectedMP.statistical_reason}

                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">
                      No statistical risk indicator detected.
                    </div>
                  )}

                  {selectedMP.ml_anomaly_signal && (
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">

                      <span className="font-medium">
                        ML risk indicator:
                      </span>{" "}

                      {selectedMP.ml_reason}

                    </div>
                  )}

                </div>
              </div>

              {/* SUPPORTING EVIDENCE */}

              {selectedMP.ml_evidence &&
                Array.isArray(selectedMP.ml_evidence) &&
                selectedMP.ml_evidence.length > 0 && (

                  <div className="mt-8">

                    <h4 className="font-semibold text-slate-800">
                      Supporting Evidence
                    </h4>

                    <div className="mt-3 overflow-x-auto">

                      <table className="w-full text-left text-sm">

                        <thead className="bg-slate-50 text-slate-500">

                          <tr>

                            <th className="px-4 py-3 font-medium">
                              Metric
                            </th>

                            <th className="px-4 py-3 font-medium">
                              Value
                            </th>

                            <th className="px-4 py-3 font-medium">
                              Percentile
                            </th>

                            <th className="px-4 py-3 font-medium">
                              Pattern
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {selectedMP.ml_evidence.map(
                            (
                              evidence: any,
                              index: number
                            ) => (

                              <tr key={index}>

                                <td className="px-4 py-3 font-medium">
                                  {evidence.metric}
                                </td>

                                <td className="px-4 py-3">
                                  {typeof evidence.value === "number"
                                    ? evidence.value.toLocaleString()
                                    : evidence.value}
                                </td>

                                <td className="px-4 py-3">
                                  {evidence.percentile}th
                                </td>

                                <td className="px-4 py-3 text-slate-600">
                                  {evidence.direction}
                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>
                  </div>
                )}

            </div>

            {/* COMPLETE MP DATA */}

            <div className="mt-8">

              <h3 className="text-lg font-bold text-slate-800">
                MP Data
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Complete financial, work and payment indicators
              </p>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  [
                    "Allocated Amount",
                    selectedMP["Allocated Amount (₹)"]
                  ],
                  [
                    "Amount Recommended",
                    selectedMP["Amount Recommended (₹)"]
                  ],
                  [
                    "Total Expenditure",
                    selectedMP["Total Expenditure (₹)"]
                  ],
                  [
                    "Utilization",
                    `${selectedMP["Utilization %"]}%`
                  ],
                  [
                    "Completed Works",
                    selectedMP["Completed Works"]
                  ],
                  [
                    "Recommended Works",
                    selectedMP["Recommended Works"]
                  ],
                  [
                    "Completion Rate",
                    `${selectedMP["Completion Rate %"]}%`
                  ],
                  [
                    "Unpaid Vendor Balance",
                    selectedMP[
                      "Balance Not Yet Paid to Vendors (₹)"
                    ]
                  ],
                  [
                    "Transaction Count",
                    selectedMP["Transaction Count"]
                  ],
                  [
                    "Successful Payments",
                    selectedMP["Successful Payments"]
                  ],
                  [
                    "Pending Payments",
                    selectedMP["Pending Payments"]
                  ]
                ].map(([title, value]) => (

                  <div
                    key={String(title)}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <p className="text-sm text-slate-500">
                      {title}
                    </p>

                    <p className="mt-3 text-xl font-bold text-slate-900">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : value}
                    </p>

                  </div>

                ))}

              </div>
            </div>

          </div>
        )}

        {/* =====================================================
            MP INTELLIGENCE MAIN PAGE
        ====================================================== */}

        {activePage === "mp-intelligence" && !selectedMP && (

          <div>

            <div>
              <h2 className="text-3xl font-bold">
                MP Intelligence
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Risk-based monitoring and investigation of MP-level patterns
              </p>
            </div>

            {/* SUMMARY CARDS */}

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  MPs Monitored
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {totalMPs || "..."}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  From MP intelligence dataset
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  MPs with Risk
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {mpData.length
                    ? MPsWithSignals
                    : "..."}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Statistical or ML risk indicator
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  No Current Risk
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {mpData.length
                    ? MPsWithoutSignals
                    : "..."}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  No risk indicator detected
                </p>

              </div>

            </div>

            {/* =====================================================
                ALLOCATION VS EXPENDITURE
            ====================================================== */}

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 w-full">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-slate-800">
                  Allocation vs Expenditure
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Overview of allocated funds and expenditure across monitored MPs.
                </p>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Pie Chart */}

                <div className="h-80">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={mpFinancialPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={115}
                        paddingAngle={3}
                        dataKey="value"
                      >

                        {mpFinancialPieData.map(
                          (_, index) => (

                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? "#ef4444"
                                  : "#cbd5e1"
                              }
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip
                        formatter={(value) =>
  `₹${(Number(value) / 10000000).toFixed(2)} Cr`
}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                {/* MP DATASET SNAPSHOT */}

                <div className="rounded-xl border border-slate-200 overflow-hidden">

                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">

                    <h3 className="font-semibold text-slate-800">
                      MP Dataset Snapshot
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Coverage and implementation indicators
                    </p>

                  </div>

                  <div className="divide-y divide-slate-200">

                    {/* Lok Sabha MPs */}

                    <div className="flex items-center justify-between px-5 py-4">

                      <span className="text-sm text-slate-600">
                        Lok Sabha MPs
                      </span>

                      <span className="font-semibold text-slate-900">

                        {mpData.length
                          ? mpData.filter(
                              (mp) =>
                                String(mp["House"]).toLowerCase() ===
                                "lok sabha"
                            ).length
                          : "..."}

                      </span>

                    </div>

                    {/* Rajya Sabha MPs */}

                    <div className="flex items-center justify-between px-5 py-4">

                      <span className="text-sm text-slate-600">
                        Rajya Sabha MPs
                      </span>

                      <span className="font-semibold text-slate-900">

                        {mpData.length
                          ? mpData.filter(
                              (mp) =>
                                String(mp["House"]).toLowerCase() ===
                                "rajya sabha"
                            ).length
                          : "..."}

                      </span>

                    </div>

                    {/* Average Allocation */}

                    <div className="flex items-center justify-between px-5 py-4">

                      <span className="text-sm text-slate-600">
                        Avg Allocation / MP
                      </span>

                      <span className="font-semibold text-slate-900">

                        {mpData.length
                          ? `₹${(
                              mpData.reduce(
                                (sum, mp) =>
                                  sum +
                                  Number(
                                    mp["Allocated Amount (₹)"] || 0
                                  ),
                                0
                              ) /
                              mpData.length /
                              10000000
                            ).toFixed(2)} Cr`
                          : "..."}

                      </span>

                    </div>

                    {/* Recommended Works */}

                    <div className="flex items-center justify-between px-5 py-4">

                      <span className="text-sm text-slate-600">
                        Recommended Works
                      </span>

                      <span className="font-semibold text-slate-900">

                        {mpData.length
                          ? mpData
                              .reduce(
                                (sum, mp) =>
                                  sum +
                                  Number(
                                    mp["Recommended Works"] || 0
                                  ),
                                0
                              )
                              .toLocaleString()
                          : "..."}

                      </span>

                    </div>

                    {/* Completed Works */}

                    <div className="flex items-center justify-between px-5 py-4">

                      <span className="text-sm text-slate-600">
                        Completed Works
                      </span>

                      <span className="font-semibold text-slate-900">

                        {mpData.length
                          ? mpData
                              .reduce(
                                (sum, mp) =>
                                  sum +
                                  Number(
                                    mp["Completed Works"] || 0
                                  ),
                                0
                              )
                              .toLocaleString()
                          : "..."}

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* RISK OVERVIEW */}

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  Statistical Risk Indicators
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {mpData.length
                    ? statisticalSignals
                    : "..."}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Based on statistical detection rules
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  ML Risk Indicators
                </p>

                <p className="mt-3 text-2xl font-bold">
                  {mpData.length
                    ? mlSignals
                    : "..."}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Detected using multivariate ML analysis
                </p>

              </div>

            </div>

            {/* MP DIRECTORY */}

            <div className="mt-10">

              <h3 className="text-lg font-bold text-slate-800">
                MP Risk Directory
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Investigate MPs with system-generated risk indicators
              </p>

            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {/* SEARCH + FILTER */}

              <div className="flex flex-wrap gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">

                <div className="flex-1">

                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Search MP
                  </label>

                  <input
                    type="text"
                    value={mpSearch}
                    onChange={(e) =>
                      setMpSearch(e.target.value)
                    }
                    placeholder="Search MP, constituency or state..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Risk
                  </label>

                  <select
                    value={mpSignalFilter}
                    onChange={(e) =>
                      setMpSignalFilter(e.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >

                    <option value="All">
                      All
                    </option>

                    <option value="Signal">
                      Risk Detected
                    </option>

                    <option value="No Signal">
                      No Current Risk
                    </option>

                  </select>

                </div>

              </div>

              {/* DIRECTORY HEADER */}

              <div className="border-b border-slate-200 px-5 py-4">

                <h4 className="font-semibold text-slate-800">
                  MP Directory
                </h4>

                <p className="mt-1 text-sm text-slate-500">

                  {filteredMPs.length > 0
                    ? `Showing ${mpStartIndex + 1}-${Math.min(
                        mpStartIndex + mpItemsPerPage,
                        filteredMPs.length
                      )} of ${filteredMPs.length} MPs`
                    : "0 MPs shown"}

                </p>

              </div>

              {/* DIRECTORY TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <thead className="bg-slate-50 text-slate-500">

                    <tr>

                      <th className="px-5 py-3 font-medium">
                        MP Name
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Constituency
                      </th>

                      <th className="px-5 py-3 font-medium">
                        House
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Risk
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Why Flagged
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {paginatedMPs.map(
                      (mp, index) => (

                        <tr
                          key={`${mp["MP Name"]}-${mpStartIndex + index}`}
                          className="hover:bg-slate-50"
                        >

                          <td className="px-5 py-4 font-medium text-slate-800">
                            {mp["MP Name"]}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {mp["Constituency"]}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {mp["House"]}
                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                mp.overall_signal
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {mp.overall_signal
                                ? "Risk"
                                : "No Risk"}
                            </span>

                          </td>

                          <td className="max-w-xs px-5 py-4 text-slate-600">

                            {mp.overall_signal ? (

                              <div className="space-y-1">

                                {mp.statistical_reason && (
                                  <p>
                                    {mp.statistical_reason}
                                  </p>
                                )}

                                {mp.ml_anomaly_signal && (
                                  <p>
                                    ML risk indicator
                                  </p>
                                )}

                              </div>

                            ) : (

                              <span className="text-slate-400">
                                No current risk indicator
                              </span>

                            )}

                          </td>

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                openMPDetails(mp)
                              }
                              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* NO RESULTS */}

              {filteredMPs.length === 0 && (

                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  No MPs match your search or filter.
                </div>

              )}

              {/* MP PAGINATION */}

              {mpTotalPages > 1 && (

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                  <button
                    onClick={() =>
                      setMpCurrentPage(
                        (page) => page - 1
                      )
                    }
                    disabled={mpCurrentPage === 1}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-slate-500">
                    Page {mpCurrentPage} of {mpTotalPages}
                  </span>

                  <button
                    onClick={() =>
                      setMpCurrentPage(
                        (page) => page + 1
                      )
                    }
                    disabled={
                      mpCurrentPage === mpTotalPages
                    }
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              )}

            </div>

          </div>
        )}

        {/* =====================================================
            OVERVIEW
        ====================================================== */}

        {activePage === "overview" && (

          <>

            <h2 className="text-2xl font-bold">
              MPLADS Implementation Intelligence
            </h2>

            {/* OVERVIEW CARDS */}

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  title: "Total Records",
                  value: overview
                    ? overview.total_records.toLocaleString()
                    : "...",
                  note: "From backend",
                },
                {
                  title: "17th Lok Sabha",
                  value: overview
                    ? overview["17th_lok_sabha"].toLocaleString()
                    : "...",
                  note: "From backend",
                },
                {
                  title: "18th Lok Sabha",
                  value: overview
                    ? overview["18th_lok_sabha"].toLocaleString()
                    : "...",
                  note: "From backend",
                },
                {
                  title: "Potential Anomalies",
                  value: overview
                    ? overview.potential_anomalies.toLocaleString()
                    : "...",
                  note: "From ML detection",
                },
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

            {/* KPI SECTION */}

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

                    {kpis
                      ? `${kpis["17th_lok_sabha"][item.value]}%`
                      : "..."}

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

            {/* ANOMALY SECTION */}

            <div className="mt-10">

              <h3 className="text-lg font-bold text-slate-800">
                Anomaly Alerts
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Records flagged for further investigation
              </p>

            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {/* FILTERS */}

              <div className="flex flex-wrap gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">

                <div>

                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Risk Level
                  </label>

                  <select
                    value={riskFilter}
                    onChange={(e) =>
                      setRiskFilter(e.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >

                    <option value="All">
                      All
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Lok Sabha
                  </label>

                  <select
                    value={lokSabhaFilter}
                    onChange={(e) =>
                      setLokSabhaFilter(e.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >

                    <option value="All">
                      All
                    </option>

                    <option value="17th">
                      17th
                    </option>

                    <option value="18th">
                      18th
                    </option>

                  </select>

                </div>

              </div>

              {/* TABLE HEADER */}

              <div className="border-b border-slate-200 px-5 py-4">

                <h4 className="font-semibold text-slate-800">
                  Flagged Records
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  ML-detected records requiring verification
                </p>

              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <thead className="bg-slate-50 text-slate-500">

                    <tr>

                      <th className="px-5 py-3 font-medium">
                        Record
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Indicator
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Risk
                      </th>

                      <th className="px-5 py-3 font-medium">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {paginatedAnomalies.map(
                      (anomaly, index) => (

                        <tr key={index}>

                          <td className="px-5 py-4 font-medium text-slate-800">
                            {anomaly.constituency_name}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {anomaly.anomaly_reason}
                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                getRiskLevel(
                                  anomaly.anomaly_score
                                ) === "High"
                                  ? "bg-red-100 text-red-700"
                                  : getRiskLevel(
                                      anomaly.anomaly_score
                                    ) === "Medium"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >

                              {getRiskLevel(
                                anomaly.anomaly_score
                              )}

                            </span>

                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {anomaly.lok_sabha}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* ANOMALY PAGINATION */}

              {totalPages > 1 && (

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                  <button
                    onClick={() =>
                      setCurrentPage(
                        (page) => page - 1
                      )
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
                      setCurrentPage(
                        (page) => page + 1
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              )}

            </div>

          </>

        )}

        {/* =====================================================
            WORK INTELLIGENCE
        ====================================================== */}

        {activePage === "work-intelligence" && (

          <div>

            <h2 className="text-2xl font-bold">
              Work Intelligence
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Work progress, delays, costs and duplicate work analysis
            </p>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-slate-600">
                Work Intelligence will be connected here.
              </p>

            </div>

          </div>

        )}

        {/* =====================================================
            PAYMENT INTELLIGENCE
        ====================================================== */}

        {activePage === "payment-intelligence" && (

          <div>

            <h2 className="text-2xl font-bold">
              Payment Intelligence
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Payment and vendor transaction analysis
            </p>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

              <p className="text-slate-600">
                Payment Intelligence will be connected here.
              </p>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}

export default App;