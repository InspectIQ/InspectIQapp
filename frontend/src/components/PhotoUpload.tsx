import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader, Camera } from 'lucide-react'
import { filesAPI } from '../services/api'

interface PhotoUploadProps {
  onPhotosUploaded: (urls: string[]) => void
  maxFiles?: number
}

export default function PhotoUpload({ onPhotosUploaded, maxFiles = 10 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ url: string; name: string }>>([])
  const [error, setError] = useState('')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useState(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  })

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    setError('')
    setUploading(true)

    try {
      const response = await filesAPI.uploadMultiple(acceptedFiles)
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const newPhotos = response.data.files.map((file: any) => ({
        url: `${apiBaseUrl}${file.url}`,
        name: file.original_filename
      }))
      
      const updated = [...uploadedPhotos, ...newPhotos]
      setUploadedPhotos(updated)
      onPhotosUploaded(updated.map(p => p.url))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }, [uploadedPhotos, onPhotosUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - uploadedPhotos.length,
    disabled: uploading || uploadedPhotos.length >= maxFiles
  })

  const removePhoto = (index: number) => {
    const updated = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updated)
    onPhotosUploaded(updated.map(p => p.url))
  }

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const fileArray = Array.from(files)
    await onDrop(fileArray)
    
    // Reset input so same file can be selected again
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Hidden camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleCameraCapture}
        className="hidden"
      />

      {/* Upload Area */}
      {uploadedPhotos.length < maxFiles && (
        <div className="space-y-3">
          {/* Mobile: Show camera button prominently */}
          {isMobile && (
            <button
              type="button"
              onClick={openCamera}
              disabled={uploading}
              className="w-full py-4 px-4 border-2 border-primary-500 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="w-6 h-6" />
              <span className="text-base">Take Photo with Camera</span>
            </button>
          )}

          {/* Desktop/Mobile: File picker */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg ${
              isMobile ? 'p-6' : 'p-8'
            } text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className={`mx-auto ${isMobile ? 'h-10 w-10' : 'h-12 w-12'} text-gray-400 mb-3`} />
            {uploading ? (
              <div className="flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin mr-2" />
                <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600`}>Uploading...</p>
              </div>
            ) : isDragActive ? (
              <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600`}>Drop the files here...</p>
            ) : (
              <div>
                <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 mb-1`}>
                  {isMobile ? 'Tap to select photos' : 'Drag & drop photos here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF, WebP (max 10MB each)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadedPhotos.length} / {maxFiles} photos uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Uploaded Photos */}
      {uploadedPhotos.length > 0 && (
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'}`}>
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    `
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className={`absolute ${isMobile ? 'top-1 right-1 p-2' : 'top-2 right-2 p-1'} bg-red-500 text-white rounded-full ${
                  isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity hover:bg-red-600 shadow-lg`}
                aria-label="Remove photo"
              >
                <X className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
              </button>
              {!isMobile && <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
