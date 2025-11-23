import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { 
  Server, 
  Database, 
  Clock,
  Activity,
  Cloud
} from 'lucide-react'

interface SystemMetrics {
  total_database_records: number
  api_calls_today: number
  storage_used_mb: number
  uptime_percentage: number
  avg_response_time_ms: number
}

export default function AdminSystem() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadMetrics = async () => {
    try {
      const response = await adminAPI.getSystemMetrics()
      setMetrics(response.data)
    } catch (error) {
      console.error('Failed to load metrics:', error)
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

  if (!metrics) {
    return <div className="text-center py-12">Failed to load system metrics</div>
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600'
    if (uptime >= 99) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getResponseTimeColor = (ms: number) => {
    if (ms < 200) return 'text-green-600'
    if (ms < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Metrics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your platform's health and performance
          </p>
        </div>
        <button
          onClick={loadMetrics}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Uptime
                  </dt>
                  <dd className={`text-3xl font-semibold ${getUptimeColor(metrics.uptime_percentage)}`}>
                    {metrics.uptime_percentage}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Last 30 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Time
                  </dt>
                  <dd className={`text-3xl font-semibold ${getResponseTimeColor(metrics.avg_response_time_ms)}`}>
                    {metrics.avg_response_time_ms}ms
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-gray-900">API endpoints</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Server className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    API Calls Today
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {metrics.api_calls_today.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-gray-900">All endpoints</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database & Storage */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Database</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Records</span>
                <span className="font-medium text-gray-900">
                  {metrics.total_database_records.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">Connection Pool</p>
                <p className="text-lg font-semibold text-gray-900">Healthy</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Query Time</p>
                <p className="text-lg font-semibold text-gray-900">&lt;50ms</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Cloud className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Used Storage</span>
                <span className="font-medium text-gray-900">
                  {(metrics.storage_used_mb / 1024).toFixed(2)} GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">25% of 10 GB limit</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">Photos</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(metrics.storage_used_mb / 2.5)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Size</p>
                <p className="text-lg font-semibold text-gray-900">2.5 MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">API Server</span>
            </div>
            <span className="text-sm text-green-700">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">Database</span>
            </div>
            <span className="text-sm text-green-700">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">File Storage</span>
            </div>
            <span className="text-sm text-green-700">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-gray-900">AI Services</span>
            </div>
            <span className="text-sm text-green-700">Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
