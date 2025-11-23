import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { 
  Users, 
  Home, 
  FileText, 
  Image,
  BarChart3,
  Clock
} from 'lucide-react'

interface DashboardStats {
  total_users: number
  active_users: number
  total_properties: number
  total_inspections: number
  completed_inspections: number
  pending_inspections: number
  total_photos: number
  new_users_this_week: number
  new_inspections_this_week: number
  avg_inspections_per_user: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load dashboard</div>
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.total_users,
      change: `+${stats.new_users_this_week} this week`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Users',
      value: stats.active_users,
      change: 'Last 30 days',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Properties',
      value: stats.total_properties,
      change: 'Total registered',
      icon: Home,
      color: 'bg-purple-500'
    },
    {
      name: 'Inspections',
      value: stats.total_inspections,
      change: `+${stats.new_inspections_this_week} this week`,
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      name: 'Completed',
      value: stats.completed_inspections,
      change: 'Inspections done',
      icon: BarChart3,
      color: 'bg-green-600'
    },
    {
      name: 'Pending',
      value: stats.pending_inspections,
      change: 'In progress',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      name: 'Photos',
      value: stats.total_photos,
      change: 'Total uploaded',
      icon: Image,
      color: 'bg-pink-500'
    },
    {
      name: 'Avg Inspections',
      value: stats.avg_inspections_per_user,
      change: 'Per user',
      icon: BarChart3,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your InspectIQ platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-gray-600">
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/admin/users"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <Users className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-500 truncate">View and edit users</p>
            </div>
          </a>

          <a
            href="/admin/analytics"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <BarChart3 className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-500 truncate">View detailed reports</p>
            </div>
          </a>

          <a
            href="/admin/system"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <FileText className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">System Metrics</p>
              <p className="text-sm text-gray-500 truncate">Monitor performance</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
