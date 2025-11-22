import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    address_line1: string
    city: string
    state: string
    postal_code: string
  }) => void
  initialValue?: string
}

export default function AddressAutocomplete({ onAddressSelect, initialValue = '' }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    
    try {
      // Using Nominatim (OpenStreetMap) - free alternative to Google Places
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `countrycodes=us&` +
        `limit=5`,
        {
          headers: {
            'User-Agent': 'InspectIQ/1.0'
          }
        }
      )
      
      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Address search failed:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Debounce the search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(value)
    }, 300)
  }

  const handleSelectAddress = (place: any) => {
    const address = place.address
    
    // Extract address components
    const addressLine1 = [
      address.house_number,
      address.road
    ].filter(Boolean).join(' ')

    const city = address.city || address.town || address.village || ''
    const state = address.state || ''
    const postal_code = address.postcode || ''

    setInputValue(place.display_name)
    setShowSuggestions(false)
    setSuggestions([])

    onAddressSelect({
      address_line1: addressLine1,
      city,
      state: state.length > 2 ? state.substring(0, 2).toUpperCase() : state.toUpperCase(),
      postal_code
    })
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Start typing an address..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((place, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(place)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {place.address.house_number} {place.address.road}
                  </div>
                  <div className="text-sm text-gray-500">
                    {place.address.city || place.address.town}, {place.address.state} {place.address.postcode}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && inputValue.length >= 3 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-4 text-sm text-gray-500">
          No addresses found. Try a different search.
        </div>
      )}
    </div>
  )
}
