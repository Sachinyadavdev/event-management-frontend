import React, { useMemo } from 'react';

const UserStats = ({ users }) => {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    const pending = users.filter(user => user.status === 'pending').length;
    
    const membershipStats = users.reduce((acc, user) => {
      acc[user.membershipType] = (acc[user.membershipType] || 0) + 1;
      return acc;
    }, {});

    const professionalStats = users.reduce((acc, user) => {
      acc[user.professionalStatus] = (acc[user.professionalStatus] || 0) + 1;
      return acc;
    }, {});

    // Calculate growth (mock data for demonstration)
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthUsers = users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === thisMonth && userDate.getFullYear() === thisYear;
    }).length;

    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const lastMonthUsers = users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === lastMonth && userDate.getFullYear() === lastMonthYear;
    }).length;

    const growthPercentage = lastMonthUsers > 0 
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
      : 0;

    return {
      total,
      active,
      inactive,
      pending,
      premium: membershipStats.premium || 0,
      basic: membershipStats.basic || 0,
      student: membershipStats.student || 0,
      professionals: professionalStats['working-professional'] || 0,
      students: professionalStats.student || 0,
      graduates: professionalStats['recent-graduate'] || 0,
      growth: {
        thisMonth: thisMonthUsers,
        lastMonth: lastMonthUsers,
        percentage: growthPercentage
      }
    };
  }, [users]);

  const statCards = [
    {
      title: 'Total Members',
      value: stats.total,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      trend: stats.growth.percentage > 0 ? 'up' : stats.growth.percentage < 0 ? 'down' : 'neutral',
      trendValue: `${stats.growth.percentage}%`,
      subtitle: 'vs last month'
    },
    {
      title: 'Active Members',
      value: stats.active,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      percentage: stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0,
      subtitle: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total`
    },
    {
      title: 'Premium Members',
      value: stats.premium,
      icon: '⭐',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      percentage: stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(1) : 0,
      subtitle: `${stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(1) : 0}% of total`
    },
    {
      title: 'Pending Approval',
      value: stats.pending,
      icon: '⏳',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      subtitle: 'Awaiting review'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center text-xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </span>
                  
                  {stat.trend && (
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === 'up' 
                        ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                        : stat.trend === 'down'
                        ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                        : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
                    }`}>
                      {stat.trend === 'up' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {stat.trend === 'down' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {stat.trendValue}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Membership Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.premium}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.premium / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Basic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.basic}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.basic / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.student}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.student / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Professional Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Working Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.professionals}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.professionals / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Students</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.students}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.students / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Graduates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.graduates}</span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.graduates / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;