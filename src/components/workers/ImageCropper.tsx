'use client'

import { useState } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Loader2 } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void
  onCancel: () => void
  aspectRatio?: number // 1 for circle, 1.585 for ID card
  circular?: boolean
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  circular = false
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: circular ? 100 : 80,
    height: circular ? 100 : 80,
    x: circular ? 0 : 10,
    y: circular ? 0 : 10,
  })
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleCrop = async () => {
    if (!imageRef || !crop) return

    setProcessing(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      const scaleX = imageRef.naturalWidth / imageRef.width
      const scaleY = imageRef.naturalHeight / imageRef.height

      canvas.width = crop.width ? crop.width * scaleX : imageRef.naturalWidth
      canvas.height = crop.height ? crop.height * scaleY : imageRef.naturalHeight

      ctx.drawImage(
        imageRef,
        (crop.x || 0) * scaleX,
        (crop.y || 0) * scaleY,
        (crop.width || 0) * scaleX,
        (crop.height || 0) * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      // If circular, clip to circle
      if (circular) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(canvas.width, canvas.height) / 2

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext('2d')

        if (tempCtx) {
          tempCtx.beginPath()
          tempCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
          tempCtx.closePath()
          tempCtx.clip()
          tempCtx.drawImage(canvas, 0, 0)

          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(tempCanvas, 0, 0)
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob)
          onCropComplete(blob, croppedImageUrl)
        }
        setProcessing(false)
      }, 'image/jpeg', 0.9)
    } catch (error) {
      console.error('Crop error:', error)
      setProcessing(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="max-h-96 overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspectRatio={aspectRatio}
              className="max-w-full mx-auto"
              circularCrop={circular}
            >
              <img
                ref={setImageRef}
                src={imageSrc}
                alt="Crop"
                className="max-w-full"
              />
            </ReactCrop>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCrop}
              disabled={processing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="ml-2 h-4 w-4" />
              )}
              تأكيد
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={processing}
              className="border-slate-600"
            >
              <X className="ml-2 h-4 w-4" />
              إلغاء
            </Button>
          </div>

          {aspectRatio === 1.585 && (
            <p className="text-xs text-slate-400 text-center">
              مقاس البطاقة: 85.6×54mm (نسبة 1.585:1)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
