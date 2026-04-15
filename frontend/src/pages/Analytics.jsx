import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import Navbar from '../components/Navbar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const Analytics = () => {
  const { analytics, loading, fetchAnalytics } = useHabits();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { summary, weekData, categoryData, habitPerformance } = analytics;

  // Transform category data for pie chart
  const categoryChartData = Object.entries(categoryData).map(([name, data]) => ({
    name,
    value: data.count,
    marks: data.marks,
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navbar />

      {/* Main Content */}
      <div className="section">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-base sm:text-lg text-gray-600">Visualize your progress and insights 📊</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTimeRange('week')}
                className={`flex-1 sm:flex-none ${timeRange === 'week' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`flex-1 sm:flex-none ${timeRange === 'month' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`flex-1 sm:flex-none ${timeRange === 'year' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Completions</div>
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {habitPerformance.reduce((sum, h) => sum + h.totalCompletions, 0)}
              </div>
              <div className="text-xs text-green-600 mt-1">All time</div>
            </div>

            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Completion Rate</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{summary.completionRate}%</div>
              <div className="text-xs text-gray-600 mt-1">Today's rate</div>
            </div>

            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Marks</div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">{summary.totalMarksEarned || 0}</div>
              <div className="text-xs text-gray-600 mt-1">All time earned</div>
            </div>

            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Longest Streak</div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">{summary.longestStreak || 0} 🔥</div>
              <div className="text-xs text-gray-600 mt-1">Consecutive days</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Completion Trend */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-4">Daily Completion Trend</h3>
                <p className="text-small text-gray-600 mt-1">Habits completed per day this week</p>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weekData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorCompleted)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Marks Earned Per Day */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-4">Marks Earned Per Day</h3>
                <p className="text-small text-gray-600 mt-1">Points accumulated daily</p>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marks" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Progress - Remove this section */}

            {/* Category Distribution */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-4">Habit Categories</h3>
                <p className="text-small text-gray-600 mt-1">Distribution by category</p>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Habit Performance Comparison */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-4">Habit Performance</h3>
                <p className="text-small text-gray-600 mt-1">Completion rate by habit</p>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={habitPerformance.map(h => ({ habit: h.name, completion: h.completionRate }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="habit" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#10B981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart - Overall Performance */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-4">Performance Radar</h3>
                <p className="text-small text-gray-600 mt-1">Multi-dimensional view</p>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={habitPerformance.map(h => ({ habit: h.name, completion: h.completionRate }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="habit" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name="Completion %" 
                      dataKey="completion" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Streak Progress */}
            <div className="card lg:col-span-2">
              <div className="card-header">
                <h3 className="heading-4">Weekly Marks Trend</h3>
                <p className="text-small text-gray-600 mt-1">Points earned each day</p>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weekData}>
                    <defs>
                      <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="marks" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorStreak)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover card-body">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💪</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Best Performing</h4>
                  <p className="text-small text-gray-600">
                    {habitPerformance.length > 0 
                      ? `"${habitPerformance[0].name}" with ${habitPerformance[0].completionRate}% completion rate!`
                      : 'Start tracking habits to see insights'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-hover card-body">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Longest Streak</h4>
                  <p className="text-small text-gray-600">
                    Your best streak is {summary.longestStreak || 0} consecutive days! Keep it up!
                  </p>
                </div>
              </div>
            </div>

            <div className="card-hover card-body">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Today's Achievement</h4>
                  <p className="text-small text-gray-600">
                    {summary.completedToday} out of {summary.totalHabits} habits completed ({summary.completionRate}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
