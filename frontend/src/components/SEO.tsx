import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonical?: string
  structuredData?: object
}

export default function SEO({
  title,
  description,
  keywords = 'property inspection, AI inspection, home inspection, inspection software, property management',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical,
  structuredData
}: SEOProps) {
  const location = useLocation()
  const baseUrl = 'https://inspectiq.app' // Update with your actual domain
  const fullUrl = canonical || `${baseUrl}${location.pathname}`
  const fullTitle = `${title} | InspectIQ - AI-Powered Property Inspections`

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Standard meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    
    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:url', fullUrl, true)
    updateMetaTag('og:type', ogType, true)
    updateMetaTag('og:image', `${baseUrl}${ogImage}`, true)
    updateMetaTag('og:site_name', 'InspectIQ', true)
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', `${baseUrl}${ogImage}`)
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = fullUrl

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]')
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }
      scriptTag.textContent = JSON.stringify(structuredData)
    }

    // Cleanup function
    return () => {
      // Remove structured data on unmount
      const scriptTag = document.querySelector('script[type="application/ld+json"]')
      if (scriptTag) {
        scriptTag.remove()
      }
    }
  }, [title, description, keywords, ogImage, ogType, fullUrl, fullTitle, structuredData])

  return null // This component doesn't render anything
}
