import { useState } from 'react'
import api from '../services/api'

export default function PromoteAdmin() {
  const [email, setEmail] = useState('')
  const [secret, setSecret] = useState('change-this-secret-key-in-production')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.post('/api/v1/setup/promote-admin', {
        email,
        secret
      })
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to promote user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Promote User to Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to become an admin
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong><br />
            1. Enter your registered email address<br />
            2. Click "Promote to Admin"<br />
            3. Log out and log back in to see Admin Panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">
                <strong>❌ Error:</strong><br />
                {error}
              </p>
            </div>
          )}

          {result && result.success && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ SUCCESS!</strong><br /><br />
                User: {result.user.name} ({result.user.email})<br />
                Role: {result.user.old_role} → {result.user.new_role}<br /><br />
                <strong>Next steps:</strong><br />
                1. Log out<br />
                2. Log back in<br />
                3. Look for "Admin Panel" link<br />
                4. Click it to access admin console!
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Promote to Admin'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <a href="/" className="text-sm text-primary-600 hover:text-primary-500">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  )
}
