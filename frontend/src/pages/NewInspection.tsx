import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { propertiesAPI, inspectionsAPI } from '../services/api'
import { ArrowLeft, Plus, Trash2, Loader } from 'lucide-react'
import PhotoUpload from '../components/PhotoUpload'
import { APP_ROUTES } from '../utils/routes'

export default function NewInspection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedPropertyId = searchParams.get('property')

  const [step, setStep] = useState(1)
  const [properties, setProperties] = useState<any[]>([])
  const [selectedProperty, setSelectedProperty] = useState(preselectedPropertyId || '')
  const [inspectionType, setInspectionType] = useState('move_in')
  const [rooms, setRooms] = useState<Array<{ room_type: string; room_name: string; photo_urls: string[] }>>([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await propertiesAPI.list()
      setProperties(response.data)
    } catch (error) {
      console.error('Failed to load properties:', error)
    }
  }

  const addRoom = () => {
    const newRoomType = 'living_room'
    setRooms([...rooms, { 
      room_type: newRoomType, 
      room_name: getRoomNameSuggestion(newRoomType), 
      photo_urls: [] 
    }])
  }

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const getRoomNameSuggestion = (roomType: string): string => {
    const suggestions: Record<string, string[]> = {
      living_room: ['Living Room', 'Family Room', 'Great Room'],
      bedroom: ['Master Bedroom', 'Bedroom 1', 'Bedroom 2', 'Guest Bedroom'],
      kitchen: ['Kitchen', 'Main Kitchen', 'Kitchenette'],
      bathroom: ['Master Bathroom', 'Bathroom 1', 'Bathroom 2', 'Guest Bathroom', 'Half Bath'],
      dining_room: ['Dining Room', 'Formal Dining', 'Breakfast Nook'],
      hallway: ['Main Hallway', 'Upstairs Hallway', 'Entry Hall'],
      other: ['Laundry Room', 'Garage', 'Basement', 'Attic', 'Office']
    }
    
    const options = suggestions[roomType] || []
    const existingNames = rooms.map(r => r.room_name.toLowerCase())
    
    // Find first suggestion not already used
    for (const suggestion of options) {
      if (!existingNames.includes(suggestion.toLowerCase())) {
        return suggestion
      }
    }
    
    // If all used, add a number
    const baseName = roomType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const count = rooms.filter(r => r.room_type === roomType).length + 1
    return `${baseName} ${count}`
  }

  const updateRoom = (index: number, field: string, value: any) => {
    const updated = [...rooms]
    
    // If changing room type, suggest a name
    if (field === 'room_type' && !updated[index].room_name) {
      updated[index] = { 
        ...updated[index], 
        [field]: value,
        room_name: getRoomNameSuggestion(value)
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    
    setRooms(updated)
  }

  const handlePhotosUploaded = (roomIndex: number, urls: string[]) => {
    const updated = [...rooms]
    updated[roomIndex].photo_urls = urls
    setRooms(updated)
  }

  const handleSubmit = async () => {
    if (!selectedProperty) {
      alert('Please select a property')
      return
    }

    if (rooms.length === 0) {
      alert('Please add at least one room')
      return
    }

    setLoading(true)
    try {
      console.log('Creating inspection with data:', {
        property_id: parseInt(selectedProperty),
        inspection_type: inspectionType
      })

      // Create inspection
      const inspectionRes = await inspectionsAPI.create({
        property_id: parseInt(selectedProperty),
        inspection_type: inspectionType
      })
      
      console.log('Inspection created:', inspectionRes.data)
      const inspectionId = inspectionRes.data.id

      // Add rooms and photos
      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i]
        console.log(`Adding room ${i + 1}:`, {
          room_type: room.room_type,
          room_name: room.room_name || room.room_type.replace('_', ' '),
          order_index: i
        })

        const roomRes = await inspectionsAPI.addRoom(inspectionId, {
          room_type: room.room_type,
          room_name: room.room_name || room.room_type.replace('_', ' '),
          order_index: i
        })
        
        console.log('Room created:', roomRes.data)
        const roomId = roomRes.data.id

        // Add photos
        for (const photoUrl of room.photo_urls) {
          console.log('Adding photo:', photoUrl)
          await inspectionsAPI.addPhoto(inspectionId, roomId, photoUrl)
        }
      }

      // Analyze
      if (rooms.some(room => room.photo_urls.length > 0)) {
        console.log('Starting analysis...')
        setAnalyzing(true)
        await inspectionsAPI.analyze(inspectionId)
      }

      // Navigate to inspection detail
      navigate(APP_ROUTES.inspectionDetail(inspectionId))
    } catch (error: any) {
      console.error('Failed to create inspection:', error)
      console.error('Error response:', error.response?.data)
      
      let errorMessage = 'Failed to create inspection'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  return (
    <div className="px-4 sm:px-0 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Inspection</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step > s ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Property</span>
            <span>Rooms & Photos</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step 1: Select Property */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Property *
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className={`block w-full border border-gray-300 rounded-md shadow-sm ${isMobile ? 'py-3 px-4 text-base' : 'py-2 px-3 text-sm'} focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              >
                <option value="">Choose a property...</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.address_line1}, {prop.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspection Type *
              </label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value)}
                className={`block w-full border border-gray-300 rounded-md shadow-sm ${isMobile ? 'py-3 px-4 text-base' : 'py-2 px-3 text-sm'} focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              >
                <option value="move_in">Move In</option>
                <option value="move_out">Move Out</option>
                <option value="routine">Routine</option>
                <option value="pre_sale">Pre-Sale</option>
                <option value="post_renovation">Post-Renovation</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedProperty}
                className={`${isMobile ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'} border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors min-w-[100px]`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Rooms & Photos */}
        {step === 2 && (
          <div className="space-y-6">
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Room {roomIndex + 1}</h3>
                  <button
                    onClick={() => removeRoom(roomIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <select
                      value={room.room_type}
                      onChange={(e) => updateRoom(roomIndex, 'room_type', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                    >
                      <option value="living_room">Living Room</option>
                      <option value="bedroom">Bedroom</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="bathroom">Bathroom</option>
                      <option value="dining_room">Dining Room</option>
                      <option value="hallway">Hallway</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Name (optional)
                    </label>
                    <input
                      type="text"
                      value={room.room_name}
                      onChange={(e) => updateRoom(roomIndex, 'room_name', e.target.value)}
                      placeholder="e.g., Master Bedroom"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos ({room.photo_urls.length})
                  </label>
                  <PhotoUpload
                    onPhotosUploaded={(urls) => handlePhotosUploaded(roomIndex, urls)}
                    maxFiles={10}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addRoom}
              className={`w-full ${isMobile ? 'py-4' : 'py-3'} border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 font-medium transition-colors`}
            >
              <Plus className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} inline mr-2`} />
              <span className={isMobile ? 'text-base' : 'text-sm'}>Add Room</span>
            </button>

            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between'} pt-4`}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`${isMobile ? 'w-full px-6 py-3 text-base' : 'px-4 py-2 text-sm'} border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={rooms.length === 0}
                className={`${isMobile ? 'w-full px-6 py-3 text-base' : 'px-4 py-2 text-sm'} border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors`}
              >
                Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Review Inspection</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Property:</strong> {properties.find(p => p.id === parseInt(selectedProperty))?.address_line1}</p>
                <p><strong>Type:</strong> {inspectionType.replace('_', ' ')}</p>
                <p><strong>Rooms:</strong> {rooms.length}</p>
                <p><strong>Total Photos:</strong> {rooms.reduce((sum, r) => sum + r.photo_urls.length, 0)}</p>
              </div>
            </div>

            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between'} pt-4`}>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={loading || analyzing}
                className={`${isMobile ? 'w-full px-6 py-3 text-base' : 'px-4 py-2 text-sm'} border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || analyzing}
                className={`${isMobile ? 'w-full px-6 py-3 text-base' : 'px-4 py-2 text-sm'} border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center transition-colors`}
              >
                {analyzing ? (
                  <>
                    <Loader className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mr-2 animate-spin`} />
                    Analyzing...
                  </>
                ) : loading ? (
                  <>
                    <Loader className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mr-2 animate-spin`} />
                    Creating...
                  </>
                ) : (
                  'Create & Analyze'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
