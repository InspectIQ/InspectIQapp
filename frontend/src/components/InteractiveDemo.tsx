import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, FileText, CheckCircle, ArrowRight, Play, Pause, ExternalLink } from 'lucide-react'

export default function InteractiveDemo() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      title: 'Capture Photos',
      description: 'Inspector takes photos of the property with their phone',
      image: '📸',
      details: 'Living Room - 4 photos captured',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AI Analysis',
      description: 'AI identifies issues and categorizes findings',
      image: '🤖',
      details: 'Analyzing: Wall damage, carpet stains, window condition...',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Review & Edit',
      description: 'Quick review of AI-generated findings',
      image: '✏️',
      details: '12 issues found - 2 critical, 5 moderate, 5 minor',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Generate Report',
      description: 'Professional PDF report created instantly',
      image: '📄',
      details: 'Report ready: 123-Main-St-Inspection.pdf',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((step) => (step + 1) % steps.length)
          return 0
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying, steps.length])

  const mockInspection = {
    property: '123 Main Street, Apt 4B',
    date: 'Nov 22, 2024',
    inspector: 'John Smith',
    rooms: [
      { name: 'Living Room', photos: 4, issues: 3 },
      { name: 'Kitchen', photos: 6, issues: 5 },
      { name: 'Bedroom', photos: 3, issues: 2 },
      { name: 'Bathroom', photos: 5, issues: 2 }
    ],
    findings: [
      { severity: 'critical', text: 'Water damage on ceiling', room: 'Bathroom' },
      { severity: 'critical', text: 'Cracked window pane', room: 'Living Room' },
      { severity: 'moderate', text: 'Carpet stains', room: 'Bedroom' },
      { severity: 'moderate', text: 'Loose cabinet door', room: 'Kitchen' },
      { severity: 'moderate', text: 'Paint chipping', room: 'Living Room' },
      { severity: 'minor', text: 'Scuff marks on wall', room: 'Hallway' },
      { severity: 'minor', text: 'Dusty vents', room: 'Kitchen' }
    ]
  }

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See It In <span className="text-blue-400">Action</span>
          </h2>
          <p className="text-xl text-gray-400">
            Watch how InspectIQ transforms a property inspection
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Demo */}
          <div className="relative">
            {/* Demo Screen */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 p-8 shadow-2xl">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 rounded-t-2xl overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${steps[currentStep].color} transition-all duration-100`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Step Content */}
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="text-8xl mb-6 animate-bounce">
                  {steps[currentStep].image}
                </div>
                
                <h3 className="text-3xl font-bold mb-3">
                  {steps[currentStep].title}
                </h3>
                
                <p className="text-gray-400 text-lg mb-6">
                  {steps[currentStep].description}
                </p>
                
                <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${steps[currentStep].color} bg-opacity-20 border border-white/20`}>
                  <p className="text-sm font-mono">
                    {steps[currentStep].details}
                  </p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center space-x-3 mt-8">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentStep(index)
                      setProgress(0)
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-blue-500 w-8'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* Play/Pause */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full flex items-center space-x-2 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mock Report Preview */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-400" />
                Sample Inspection Report
              </h3>
              
              <div className="space-y-4">
                {/* Property Info */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-400">Property</div>
                      <div className="font-semibold">{mockInspection.property}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Date</div>
                      <div className="font-semibold">{mockInspection.date}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Inspector</div>
                      <div className="font-semibold">{mockInspection.inspector}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Total Issues</div>
                      <div className="font-semibold">{mockInspection.findings.length}</div>
                    </div>
                  </div>
                </div>

                {/* Rooms Summary */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-300">Rooms Inspected</h4>
                  <div className="space-y-2">
                    {mockInspection.rooms.map((room, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <span className="font-medium">{room.name}</span>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{room.photos} photos</span>
                          <span className={room.issues > 0 ? 'text-orange-400' : 'text-green-400'}>
                            {room.issues} issues
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-300">Key Findings</h4>
                  <div className="space-y-2">
                    {mockInspection.findings.slice(0, 5).map((finding, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          finding.severity === 'critical' ? 'bg-red-500' :
                          finding.severity === 'moderate' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm">{finding.text}</div>
                          <div className="text-xs text-gray-500">{finding.room}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">2</div>
                    <div className="text-xs text-gray-400">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">5</div>
                    <div className="text-xs text-gray-400">Moderate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">5</div>
                    <div className="text-xs text-gray-400">Minor</div>
                  </div>
                </div>

                {/* View Full Report Button */}
                <button 
                  onClick={() => navigate('/demo')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Full Interactive Report
                </button>
              </div>
            </div>

            {/* Time Saved */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Time Saved</div>
                  <div className="text-3xl font-bold text-green-400">2.5 hours</div>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Traditional method: 3 hours • InspectIQ: 30 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
