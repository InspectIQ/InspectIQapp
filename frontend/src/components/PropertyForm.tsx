import { useState } from 'react'
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { propertiesAPI } from '../services/api'
import AddressAutocomplete from './AddressAutocomplete'

interface PropertyFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function PropertyForm({ onSuccess, onCancel }: PropertyFormProps) {
  // Load saved defaults from localStorage
  const getSavedDefaults = () => {
    try {
      const saved = localStorage.getItem('propertyFormDefaults')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  const defaults = getSavedDefaults()
  
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: defaults.state || '',
    postal_code: '',
    unit_number: '',
    property_type: defaults.property_type || 'apartment',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    year_built: '',
    lot_size: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [error, setError] = useState('')
  const [lookupSuccess, setLookupSuccess] = useState(false)

  const handleAddressLookup = async () => {
    if (!formData.address_line1.trim()) {
      setError('Please enter an address first')
      return
    }

    setLookupLoading(true)
    setError('')
    setLookupSuccess(false)

    try {
      const fullAddress = `${formData.address_line1}, ${formData.city}, ${formData.state} ${formData.postal_code}`.trim()
      const response = await propertiesAPI.lookupAddress(fullAddress)
      
      if (response.data.success && response.data.property_data) {
        const data = response.data.property_data
        
        // Auto-fill the form with looked up data
        setFormData(prev => ({
          ...prev,
          bedrooms: data.bedrooms?.toString() || prev.bedrooms,
          bathrooms: data.bathrooms?.toString() || prev.bathrooms,
          square_feet: data.square_feet?.toString() || prev.square_feet,
          year_built: data.year_built?.toString() || prev.year_built,
          lot_size: data.lot_size?.toString() || prev.lot_size,
          property_type: data.property_type?.toLowerCase() || prev.property_type
        }))
        
        setLookupSuccess(true)
        setTimeout(() => setLookupSuccess(false), 3000)
      } else {
        setError('No property data found for this address. You can still create the property manually.')
      }
    } catch (err: any) {
      setError('Failed to lookup property data. You can still create the property manually.')
    } finally {
      setLookupLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        unit_number: formData.unit_number,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        square_feet: formData.square_feet ? parseFloat(formData.square_feet) : undefined,
        year_built: formData.year_built ? parseInt(formData.year_built) : undefined,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : undefined,
        notes: formData.notes
      }
      
      // Remove undefined values
      Object.keys(data).forEach(key => {
        if (data[key as keyof typeof data] === undefined) {
          delete data[key as keyof typeof data]
        }
      })
      
      await propertiesAPI.create(data)
      
      // Save preferences for next time
      localStorage.setItem('propertyFormDefaults', JSON.stringify({
        property_type: formData.property_type,
        state: formData.state
      }))
      
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddressSelect = (address: {
    address_line1: string
    city: string
    state: string
    postal_code: string
  }) => {
    setFormData({
      ...formData,
      address_line1: address.address_line1,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code
    })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Property</h2>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {lookupSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">✅ Property data found and auto-filled!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Address *
            </label>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              initialValue={formData.address_line1}
            />
            <p className="mt-1 text-xs text-gray-500">
              Start typing to search for an address, or enter manually below
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address Line 1 *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="address_line1"
                required
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="123 Main St"
                className="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddressLookup}
                disabled={lookupLoading || !formData.address_line1.trim()}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Auto-fill property details"
              >
                {lookupLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-primary-600 rounded-full"></div>
                ) : (
                  <SparklesIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Click the ✨ button to auto-fill property details from address
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <input
              type="text"
              name="state"
              required
              maxLength={2}
              value={formData.state}
              onChange={handleChange}
              placeholder="CA"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postal Code *
            </label>
            <input
              type="text"
              name="postal_code"
              required
              value={formData.postal_code}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Number
            </label>
            <input
              type="text"
              name="unit_number"
              value={formData.unit_number}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="single family home">Single Family Home</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="duplex">Duplex</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              max="20"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              max="20"
              step="0.5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Square Feet
            </label>
            <input
              type="number"
              name="square_feet"
              value={formData.square_feet}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year Built
            </label>
            <input
              type="number"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              placeholder={`e.g., ${new Date().getFullYear() - 10}`}
              min="1800"
              max={new Date().getFullYear()}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lot Size (acres)
            </label>
            <input
              type="number"
              name="lot_size"
              value={formData.lot_size}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.25"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
