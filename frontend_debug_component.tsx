// Add this component temporarily to your Dashboard.tsx to debug the API issues
// Replace the loadData function in Dashboard.tsx with this enhanced version:

const loadData = async () => {
  console.log('🔍 Starting data load...')
  
  try {
    // Test properties API separately
    console.log('📡 Loading properties...')
    const propsRes = await propertiesAPI.list()
    console.log('✅ Properties loaded:', propsRes.data)
    setProperties(propsRes.data)
    
    // Test inspections API separately  
    console.log('📡 Loading inspections...')
    const inspsRes = await inspectionsAPI.list()
    console.log('✅ Inspections loaded:', inspsRes.data)
    setInspections(inspsRes.data)
    
  } catch (error) {
    console.error('❌ Failed to load data:', error)
    
    // More detailed error logging
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request made but no response:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }
    
    // Try to load properties and inspections separately to isolate the issue
    try {
      console.log('🔄 Trying properties only...')
      const propsRes = await propertiesAPI.list()
      setProperties(propsRes.data)
      console.log('✅ Properties loaded separately')
    } catch (propError) {
      console.error('❌ Properties failed:', propError)
    }
    
    try {
      console.log('🔄 Trying inspections only...')
      const inspsRes = await inspectionsAPI.list()
      setInspections(inspsRes.data)
      console.log('✅ Inspections loaded separately')
    } catch (inspError) {
      console.error('❌ Inspections failed:', inspError)
    }
    
  } finally {
    setLoading(false)
  }
}

// Also add this debug info to your Dashboard render:
// Add this right after the loading check:

if (!loading) {
  console.log('📊 Dashboard state:', {
    propertiesCount: properties.length,
    inspectionsCount: inspections.length,
    properties: properties,
    inspections: inspections
  })
}

// Temporary debug display - add this before the stats section:
{process.env.NODE_ENV === 'development' && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
    <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h3>
    <div className="text-xs text-yellow-700">
      <p>Properties loaded: {properties.length}</p>
      <p>Inspections loaded: {inspections.length}</p>
      <p>Check browser console for detailed logs</p>
    </div>
  </div>
)}