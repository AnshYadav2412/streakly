import React, { useState, useMemo } from 'react';

const StreakCalendar = ({ habits }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the current month
  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Get the last day of the current month
  const getMonthEnd = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar data for the current month
  const calendarData = useMemo(() => {
    const monthStart = getMonthStart(currentDate);
    const monthEnd = getMonthEnd(currentDate);
    const startDate = new Date(monthStart);
    
    // Start from the first Monday of the week containing the first day of the month
    const startDay = startDate.getDay();
    const daysToSubtract = startDay === 0 ? 6 : startDay - 1; // Monday = 0
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const days = [];
    const currentDateObj = new Date(startDate);

    // Generate 6 weeks (42 days) to ensure we cover the entire month
    for (let i = 0; i < 42; i++) {
      const dateKey = currentDateObj.toISOString().split('T')[0];
      const isCurrentMonth = currentDateObj.getMonth() === currentDate.getMonth();
      const isToday = currentDateObj.toDateString() === new Date().toDateString();
      const isFuture = currentDateObj > new Date();

      // Calculate completed habits for this day
      const completedHabits = habits.filter(habit => {
        const completedDates = habit.completedDates instanceof Map 
          ? habit.completedDates 
          : new Map(Object.entries(habit.completedDates || {}));
        return completedDates.get(dateKey);
      });

      const completionCount = completedHabits.length;
      const totalHabits = habits.length;
      const completionRate = totalHabits > 0 ? completionCount / totalHabits : 0;

      days.push({
        date: new Date(currentDateObj),
        dateKey,
        day: currentDateObj.getDate(),
        isCurrentMonth,
        isToday,
        isFuture,
        completedHabits,
        completionCount,
        totalHabits,
        completionRate
      });

      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  }, [currentDate, habits]);

  // Get intensity class based on completion rate
  const getIntensityClass = (completionRate, isCurrentMonth, isFuture) => {
    if (!isCurrentMonth || isFuture) {
      return 'bg-gray-100 border-gray-200';
    }

    if (completionRate === 0) {
      return 'bg-gray-200 border-gray-300 hover:bg-gray-300';
    } else if (completionRate <= 0.25) {
      return 'bg-amber-200 border-amber-300 hover:bg-amber-300';
    } else if (completionRate <= 0.5) {
      return 'bg-amber-300 border-amber-400 hover:bg-amber-400';
    } else if (completionRate <= 0.75) {
      return 'bg-amber-400 border-amber-500 hover:bg-amber-500';
    } else {
      return 'bg-amber-500 border-amber-600 hover:bg-amber-600';
    }
  };

  // Calculate current streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const hasActivity = habits.some(habit => {
        const completedDates = habit.completedDates instanceof Map 
          ? habit.completedDates 
          : new Map(Object.entries(habit.completedDates || {}));
        return completedDates.get(dateKey);
      });

      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate longest streak
  const calculateLongestStreak = () => {
    if (habits.length === 0) return 0;
    
    let maxStreak = 0;
    let currentStreak = 0;
    const today = new Date();
    
    // Go back 365 days to check for streaks
    for (let i = 365; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const hasActivity = habits.some(habit => {
        const completedDates = habit.completedDates instanceof Map 
          ? habit.completedDates 
          : new Map(Object.entries(habit.completedDates || {}));
        return completedDates.get(dateKey);
      });
      
      if (hasActivity) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = () => {
    const monthStart = getMonthStart(currentDate);
    const monthEnd = getMonthEnd(currentDate);
    const today = new Date();
    
    let completedDays = 0;
    let totalDays = 0;
    
    const currentDateObj = new Date(monthStart);
    while (currentDateObj <= monthEnd && currentDateObj <= today) {
      const dateKey = currentDateObj.toISOString().split('T')[0];
      const hasActivity = habits.some(habit => {
        const completedDates = habit.completedDates instanceof Map 
          ? habit.completedDates 
          : new Map(Object.entries(habit.completedDates || {}));
        return completedDates.get(dateKey);
      });
      
      if (hasActivity) completedDays++;
      totalDays++;
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    return { completedDays, completionRate };
  };

  // Calculate total activity days
  const calculateTotalActivity = () => {
    const allDates = new Set();
    
    habits.forEach(habit => {
      const completedDates = habit.completedDates instanceof Map 
        ? habit.completedDates 
        : new Map(Object.entries(habit.completedDates || {}));
      
      completedDates.forEach((completed, dateKey) => {
        if (completed) {
          allDates.add(dateKey);
        }
      });
    });
    
    return allDates.size;
  };

  const currentStreak = calculateStreak();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Habit Streak</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Current streak: <span className="font-bold text-amber-600">{currentStreak} days</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h4 className="text-sm sm:text-base font-semibold min-w-[140px] text-center">
              {monthName}
            </h4>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-xs font-semibold text-gray-600 text-center py-1 w-12 flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      relative w-12 h-12 rounded border transition-all duration-200 cursor-pointer
                      ${getIntensityClass(day.completionRate, day.isCurrentMonth, day.isFuture)}
                      ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      group
                    `}
                    title={
                      day.isFuture 
                        ? 'Future date'
                        : day.completionCount > 0 
                        ? `${day.completionCount}/${day.totalHabits} habits completed\n${day.completedHabits.map(h => h.name).join(', ')}`
                        : day.isCurrentMonth 
                        ? 'No habits completed'
                        : ''
                    }
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xs font-medium ${
                        day.isCurrentMonth 
                          ? day.completionRate > 0.5 ? 'text-white' : 'text-gray-700'
                          : 'text-gray-400'
                      }`}>
                        {day.day}
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    {day.isCurrentMonth && !day.isFuture && day.completionCount > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                        <div className="font-semibold mb-1">
                          {day.completionCount}/{day.totalHabits} habits completed
                        </div>
                        <div className="space-y-1">
                          {day.completedHabits.map((habit, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              <span>{habit.name}</span>
                            </div>
                          ))}
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded border"></div>
                  <div className="w-3 h-3 bg-amber-200 rounded border"></div>
                  <div className="w-3 h-3 bg-amber-300 rounded border"></div>
                  <div className="w-3 h-3 bg-amber-400 rounded border"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded border"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Current Streak - Featured */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Current Streak</h4>
                  <p className="text-amber-100 text-sm">Keep the momentum going!</p>
                </div>
              </div>
              <div className="text-4xl font-bold">
                {currentStreak}
                <span className="text-lg font-normal ml-2">days</span>
              </div>
            </div>

            {/* Other Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-base">Best Streak</span>
                    <p className="text-xs text-gray-500">Personal record</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {calculateLongestStreak()}
                  <span className="text-sm font-normal text-gray-500 ml-1">days</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-base">This Month</span>
                    <p className="text-xs text-gray-500">{calculateMonthlyStats().completionRate}% completion</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {calculateMonthlyStats().completedDays}
                  <span className="text-sm font-normal text-gray-500 ml-1">days</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-base">Total Active</span>
                    <p className="text-xs text-gray-500">All time activity</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {calculateTotalActivity()}
                  <span className="text-sm font-normal text-gray-500 ml-1">days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;