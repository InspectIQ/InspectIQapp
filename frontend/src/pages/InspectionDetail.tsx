import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { inspectionsAPI } from '../services/api'
import { ArrowLeft, FileText, AlertCircle, DollarSign, Clock, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function InspectionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [inspection, setInspection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (id) {
      loadInspection()
    }
  }, [id])

  const loadInspection = async () => {
    try {
      const response = await inspectionsAPI.get(parseInt(id!))
      setInspection(response.data)
    } catch (error) {
      console.error('Failed to load inspection:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Inspection not found</p>
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const response = await inspectionsAPI.downloadPDF(parseInt(id!))
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `inspection_${id}_report.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download PDF:', error)
      alert('Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {inspection.inspection_type.replace('_', ' ').toUpperCase()} Inspection
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date(inspection.inspection_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {inspection.status === 'completed' && (
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            )}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              inspection.status === 'completed' 
                ? 'bg-green-100 text-green-800'
                : inspection.status === 'processing'
                ? 'bg-yellow-100 text-yellow-800'
                : inspection.status === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {inspection.status}
            </span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {inspection.status === 'processing' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            AI analysis in progress. This may take a few minutes...
          </p>
        </div>
      )}

      {inspection.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            Analysis failed. Please try again or contact support.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {inspection.summary_stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-primary-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Issues Found</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inspection.summary_stats.issue_count || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Severity</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {inspection.summary_stats.summary_severity || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Est. Cost</p>
                <p className="text-lg font-bold text-gray-900">
                  ${inspection.summary_stats.summary_cost_low || 0} - ${inspection.summary_stats.summary_cost_high || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Rooms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inspection.rooms?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issues List */}
      {inspection.issues_detected && inspection.issues_detected.length > 0 && (
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Detected Issues</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {inspection.issues_detected.map((issue: any, index: number) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-sm text-gray-500">
                        {issue.room_name || 'Unknown Room'}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 capitalize">
                      {issue.issue_type?.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  </div>
                </div>

                {issue.recommended_action && (
                  <div className="mt-3 bg-gray-50 rounded p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Recommended Action:</p>
                    <p className="text-sm text-gray-600">{issue.recommended_action}</p>
                    {issue.cost_low && issue.cost_high && (
                      <p className="text-xs text-gray-500 mt-2">
                        Est. Cost: ${issue.cost_low} - ${issue.cost_high} • 
                        {issue.time_hours && ` ${issue.time_hours}h`} • 
                        {issue.diy_possible ? ' DIY Possible' : ' Professional Required'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Report */}
      {inspection.report_markdown && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Full Report</h2>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{inspection.report_markdown}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* No Results */}
      {inspection.status === 'completed' && !inspection.report_markdown && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No report available</h3>
          <p className="mt-1 text-sm text-gray-500">
            The analysis completed but no report was generated.
          </p>
        </div>
      )}
    </div>
  )
}
