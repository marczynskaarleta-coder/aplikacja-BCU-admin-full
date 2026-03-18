'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Listen for beforeinstallprompt event (Chrome/Edge/Samsung)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // For iOS, show prompt after delay if not installed
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 5000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Check if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - dismissedTime < sevenDays) {
        setShowPrompt(false)
      }
    }
  }, [])

  if (isStandalone || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-foreground text-background p-4 shadow-lg border-2 border-primary z-50 animate-in slide-in-from-bottom-5">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-background/20 transition-colors"
        aria-label="Zamknij"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-primary p-2">
          <Smartphone className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Zainstaluj aplikację</h3>
          <p className="text-sm text-background/80 mt-1">
            Dodaj BCU Spedycja do ekranu głównego dla szybszego dostępu.
          </p>
          
          {isIOS ? (
            <div className="mt-3 text-sm text-background/80">
              <p>Kliknij <strong>Udostępnij</strong> (ikona ze strzałką), a następnie <strong>Dodaj do ekranu głównego</strong>.</p>
            </div>
          ) : (
            <Button 
              onClick={handleInstall}
              className="mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              Zainstaluj
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
