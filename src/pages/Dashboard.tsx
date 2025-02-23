import { 
  BuildingStorefrontIcon, 
  TagIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data - Replace with real data from your backend
const stats = [
  {
    name: 'Total Restaurants',
    value: '24',
    icon: BuildingStorefrontIcon,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Active Offers',
    value: '12',
    icon: TagIcon,
    change: '+2.02%',
    changeType: 'positive',
  },
  {
    name: 'Total Users',
    value: '2.7k',
    icon: UserGroupIcon,
    change: '+10.45%',
    changeType: 'positive',
  },
  {
    name: 'Revenue',
    value: '$45.2k',
    icon: CurrencyDollarIcon,
    change: '+8.24%',
    changeType: 'positive',
  },
];

const userGrowthData = [
  { month: 'Jan', users: 1000 },
  { month: 'Feb', users: 1500 },
  { month: 'Mar', users: 2000 },
  { month: 'Apr', users: 2400 },
  { month: 'May', users: 2600 },
  { month: 'Jun', users: 2700 },
];

const userTypeData = [
  { name: 'Regular Customers', value: 60, color: '#FF6B6B' },
  { name: 'Premium Members', value: 25, color: '#4CAF50' },
  { name: 'Business Accounts', value: 15, color: '#2196F3' },
];

const topRestaurants = [
  {
    name: 'Pizza Palace',
    rating: 4.8,
    orders: 1245,
    revenue: '$12.4k',
    growth: '+12.5%',
  },
  {
    name: 'Sushi Master',
    rating: 4.7,
    orders: 1100,
    revenue: '$10.8k',
    growth: '+8.3%',
  },
  {
    name: 'Burger House',
    rating: 4.6,
    orders: 980,
    revenue: '$9.2k',
    growth: '+15.2%',
  },
  {
    name: 'Taco Fiesta',
    rating: 4.5,
    orders: 850,
    revenue: '$8.5k',
    growth: '+6.7%',
  },
];

const recentActivity = [
  {
    type: 'order',
    description: 'New order from John Doe',
    time: '5 minutes ago',
    amount: '$45.00',
  },
  {
    type: 'restaurant',
    description: 'New restaurant joined: Asian Fusion',
    time: '15 minutes ago',
  },
  {
    type: 'user',
    description: 'New premium member: Sarah Smith',
    time: '30 minutes ago',
  },
  {
    type: 'offer',
    description: 'Flash sale started: 20% off on Italian',
    time: '1 hour ago',
  },
];

export default function Dashboard() {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold text-surface-900">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-surface-500">Last updated: 5 minutes ago</span>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {stats.map((item) => (
          <div key={item.name} className="card w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <item.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-surface-500">{item.name}</h3>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold text-surface-900">{item.value}</p>
                  <span className={`ml-2 text-sm ${
                    item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
        {/* User Growth Chart */}
        <div className="card w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">User Growth</h2>
            <ChartBarIcon className="h-5 w-5 text-surface-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#FF6B6B"
                  fillOpacity={1}
                  fill="url(#userGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Type Distribution */}
        <div className="card w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">User Distribution</h2>
            <UserGroupIcon className="h-5 w-5 text-surface-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6">
              {userTypeData.map((type) => (
                <div key={type.name} className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm text-surface-600">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
        {/* Top Restaurants */}
        <div className="card w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Top Performing Restaurants</h2>
            <ArrowTrendingUpIcon className="h-5 w-5 text-surface-400" />
          </div>
          <div className="divide-y divide-surface-200">
            {topRestaurants.map((restaurant) => (
              <div key={restaurant.name} className="py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-surface-900">{restaurant.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-surface-600 ml-1">{restaurant.rating}</span>
                    <span className="text-sm text-surface-400 mx-2">•</span>
                    <span className="text-sm text-surface-600">{restaurant.orders} orders</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-surface-900">{restaurant.revenue}</p>
                  <p className="text-sm text-green-600">{restaurant.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Recent Activity</h2>
            <ClockIcon className="h-5 w-5 text-surface-400" />
          </div>
          <div className="divide-y divide-surface-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="py-3">
                <div className="flex justify-between">
                  <p className="text-surface-900">{activity.description}</p>
                  {activity.amount && (
                    <span className="font-medium text-surface-900">{activity.amount}</span>
                  )}
                </div>
                <p className="text-sm text-surface-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary w-full mt-4">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
