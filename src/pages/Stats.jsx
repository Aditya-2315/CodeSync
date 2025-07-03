import { ResponsiveContainer, BarChart, PieChart, LineChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from "recharts";
import useUserStats from "../hooks/userUserStats";
import { useState } from "react";

const Stats = () => {
  const { longestStreak, lifetimeStats, platformStats,monthlyChartData,pieChartData } = useUserStats()
  const [chartType, setChartType] = useState('bar')

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sortedMonthlyChartData = [...monthlyChartData].sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  // Combine pie chart data for problems and commits into one array for a single pie chart
  const combinedPieChartData = pieChartData
    .flatMap(item => ([
      { name: `${item.platform} Problems`, value: item.problems },
      { name: `${item.platform} Commits`, value: item.commits }
    ]))
    .filter(d => d.value > 0);

  return (
    <div className="p-4 flex flex-col space-y-6">
      <h1 className="text-xl self-center font-semibold text-light-text-primary dark:text-dark-text-primary">
        Your Stats
      </h1>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Total Problems Solved</p>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {lifetimeStats.problems}
          </h2>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Total GitHub Commits</p>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {lifetimeStats.commits}
          </h2>
        </div>
        <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Longest Streak</p>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {longestStreak || 0} Days 
          </h2>
        </div>
      </section>

      {/* Charts */}
      <section className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
        <p className="text-base font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Monthly Breakdown</p>
        <div className="mb-4 flex flex-wrap gap-2 justify-end">
  {['bar', 'line', 'pie'].map(type => (
    <button
      key={type}
      onClick={() => setChartType(type)}
      aria-pressed={chartType === type}
      className={`px-3 py-1 rounded-md text-sm cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        chartType === type
          ? 'dark:bg-dark-accent bg-light-accent text-light-text-primary dark:text-dark-text-primary'
          : 'bg-light-border dark:bg-dark-border text-light-text-secondary dark:text-dark-text-secondary'
      }`}
    >
      {type.toUpperCase()}
    </button>
  ))}
</div>
{chartType === 'bar' && sortedMonthlyChartData.length > 0 && (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={sortedMonthlyChartData}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="problems" fill="#3b82f6" />
      <Bar dataKey="commits" fill="#10b981" />
    </BarChart>
  </ResponsiveContainer>
)}

{chartType === 'line' && sortedMonthlyChartData.length > 0 && (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={sortedMonthlyChartData}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="problems" stroke="#3b82f6" />
      <Line type="monotone" dataKey="commits" stroke="#10b981" />
    </LineChart>
  </ResponsiveContainer>
)}

{chartType === 'pie' && combinedPieChartData.length > 0 && (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      {(() => {
        const COLORS = ['#3b82f6', '#10b981', '#f97316', '#f43f5e', '#8b5cf6', '#14b8a6', '#facc15'];
        return (
          <Pie
            data={combinedPieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {combinedPieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        );
      })()}
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
)}

{(chartType === 'bar' && sortedMonthlyChartData.length === 0) ||
 (chartType === 'line' && sortedMonthlyChartData.length === 0) ||
 (chartType === 'pie' && combinedPieChartData.length === 0) ? (
  <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
    No data available
  </p>
) : null}
      </section>

      {/* Platform Breakdown */}
      <section className="bg-light-surface dark:bg-dark-surface p-4 rounded-xl shadow">
        <p className="text-base font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Platform Breakdown</p>
        <div className="grid md:grid-cols-5 grid-cols-2 gap-4 text-center text-sm text-light-text-primary dark:text-dark-text-primary">
          {Object.entries(platformStats).map(([platform, stats]) => (
            <div key={platform}>
              <p className="font-medium">{platform}</p>
              {stats.problems > 0 && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{stats.problems} Problems</p>
              )}
              {stats.commits > 0 && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{stats.commits} Commits</p>
              )}
              {stats.problems === 0 && stats.commits === 0 && (
                <p className="text-light-text-secondary dark:text-dark-text-secondary">0 Activity</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Stats