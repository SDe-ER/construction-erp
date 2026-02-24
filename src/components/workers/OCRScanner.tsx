'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface OCRScannerProps {
  onTextExtracted: (data: ExtractedData) => void
  placeholder?: string
}

export interface ExtractedData {
  nameAr?: string
  nameEn?: string
  idNumber?: string
  birthDate?: string
  expiryDate?: string
  rawText?: string
}

export function OCRScanner({ onTextExtracted, placeholder = 'امسح بطاقة هوية أو إقامة' }: OCRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Perform OCR
    setScanning(true)
    try {
      const Tesseract = (await import('tesseract.js')).default
      const result = await Tesseract.recognize(file, 'ara+eng', {
        logger: (m: any) => console.log(m),
      })

      const data = extractDataFromText(result.data.text)
      setExtractedData(data)
      setShowReview(true)
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error('فشل قراءة المستند')
    } finally {
      setScanning(false)
    }
  }

  const extractDataFromText = (text: string): ExtractedData => {
    const data: ExtractedData = { rawText: text }

    // Extract ID Number (10 digits)
    const idMatch = text.match(/\b\d{10}\b/)
    if (idMatch) data.idNumber = idMatch[0]

    // Extract dates (DD/MM/YYYY or YYYY-MM-DD formats)
    const dateMatches = text.match(/\b(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/g)
    if (dateMatches && dateMatches.length >= 2) {
      data.birthDate = dateMatches[0]
      data.expiryDate = dateMatches[dateMatches.length - 1]
    }

    // Extract Arabic name (after common labels)
    const nameArMatch = text.match(/(?:الاسم|الاسم الثلاثي)[:\s]*([أ-ى\s]+)/i)
    if (nameArMatch) data.nameAr = nameArMatch[1].trim()

    // Extract English name
    const nameEnMatch = text.match(/(?:Name)[:\s]*([A-Za-z\s]+)/i)
    if (nameEnMatch) data.nameEn = nameEnMatch[1].trim()

    return data
  }

  const handleConfirm = () => {
    onTextExtracted(extractedData)
    setShowReview(false)
    setPreview(null)
    setExtractedData({})
    toast.success('تم استخراج البيانات بنجاح')
  }

  const handleCancel = () => {
    setShowReview(false)
  }

  const clearPreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            {scanning && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2"
              onClick={clearPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Camera className="h-12 w-12 mx-auto text-slate-400" />
            <p className="text-slate-300">{placeholder}</p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-600"
              >
                <Camera className="ml-2 h-4 w-4" />
                الكاميرا
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-600"
              >
                <Upload className="ml-2 h-4 w-4" />
                رفع صورة
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">مراجعة البيانات المستخرجة</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {extractedData.nameAr && (
              <div className="space-y-2">
                <Label className="text-slate-300">الاسم</Label>
                <Input
                  value={extractedData.nameAr}
                  onChange={(e) => setExtractedData({ ...extractedData, nameAr: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}

            {extractedData.idNumber && (
              <div className="space-y-2">
                <Label className="text-slate-300">رقم الهوية</Label>
                <Input
                  value={extractedData.idNumber}
                  onChange={(e) => setExtractedData({ ...extractedData, idNumber: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}

            {extractedData.birthDate && (
              <div className="space-y-2">
                <Label className="text-slate-300">تاريخ الميلاد</Label>
                <Input
                  value={extractedData.birthDate}
                  onChange={(e) => setExtractedData({ ...extractedData, birthDate: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}

            {extractedData.expiryDate && (
              <div className="space-y-2">
                <Label className="text-slate-300">تاريخ الانتهاء</Label>
                <Input
                  value={extractedData.expiryDate}
                  onChange={(e) => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Check className="ml-2 h-4 w-4" />
                تأكيد
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-slate-600">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
