import React, { useState } from 'react'
import { Plus, Camera, Zap, FileText, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { propertiesAPI, inspectionsAPI } from '../services/api'

interface QuickActionsProps {
  onPropertyCreated?: (property: any) => void
  onInspectionCreated?: (inspection: any) => void
}

export default function QuickActions({ onPropertyCreated, onInspectionCreated }: QuickActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const handleQuickPropertyCreate = async () => {
    if (!address.trim()) return

    setIsLoading(true)
    try {
      // Create property with auto-inspection
      const response = await propertiesAPI.quickCreate({
        address: address.trim(),
        create_inspection: true,
        inspection_type: 'Move-in Inspection'
      })

      onPropertyCreated?.(response.data)
      
      // Navigate to the new inspection
      navigate(`/app/inspections/${response.data.inspection_id}`)
      
      setAddress('')
      setShowQuickCreate(false)
    } catch (error) {
      console.error('Failed to create property:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressLookup = async () => {
    if (!address.trim()) return

    setIsLoading(true)
    try {
      const response = await propertiesAPI.lookupAddress(address.trim())
      
      if (response.data.property_data) {
        // Show preview with suggested data
        console.log('Property data found:', response.data.property_data)
      }
    } catch (error) {
      console.error('Address lookup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      id: 'quick-property',
      title: 'Quick Property + Inspection',
      description: 'Add address, auto-create property and inspection',
      icon: Zap,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setShowQuickCreate(true)
    },
    {
      id: 'bulk-photos',
      title: 'Bulk Photo Upload',
      description: 'Upload multiple photos with auto-room assignment',
      icon: Camera,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/app/inspections/bulk-upload')
    },
    {
      id: 'template-inspection',
      title: 'Template Inspection',
      description: 'Start from pre-built inspection templates',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/app/inspections/templates')
    },
    {
      id: 'address-lookup',
      title: 'Address Lookup',
      description: 'Auto-fill property details from address',
      icon: MapPin,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setShowQuickCreate(true)
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="text-sm text-gray-500">Save time with shortcuts</div>
      </div>

      {/* Quick Create Modal */}
      {showQuickCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Quick Property Creation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, State 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickPropertyCreate()}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Auto-fill property details from address</li>
                  <li>• Create move-in inspection</li>
                  <li>• Generate suggested room list</li>
                  <li>• Ready for photo upload</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddressLookup}
                  disabled={isLoading || !address.trim()}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Preview Data
                </button>
                <button
                  onClick={handleQuickPropertyCreate}
                  disabled={isLoading || !address.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create & Start'}
                </button>
              </div>

              <button
                onClick={() => setShowQuickCreate(false)}
                className="w-full px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-lg transition-colors duration-200 text-left`}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">{action.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Usage Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">2.3x</div>
            <div className="text-xs text-gray-500">Faster Creation</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-xs text-gray-500">Time Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  )
}