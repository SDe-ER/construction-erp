'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { ImageCropper } from './ImageCropper'
import { OCRScanner, ExtractedData } from './OCRScanner'
import { toast } from 'sonner'

const workerSchema = z.object({
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().optional(),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  nationality: z.string().optional(),
  birthDate: z.string().optional(),
  joinDate: z.string().min(1, 'تاريخ الانضمام مطلوب'),
  baseSalary: z.string().min(1, 'الراتب الأساسي مطلوب'),
  foodAllowance: z.string().default('0'),
  residenceNumber: z.string().optional(),
  residenceExpiry: z.string().optional(),
  idNumber: z.string().min(1, 'رقم الهوية مطلوب'),
  idExpiry: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  notes: z.string().optional(),
})

type WorkerFormData = z.infer<typeof workerSchema>

interface WorkerFormProps {
  onSuccess?: () => void
  initialData?: Partial<WorkerFormData>
}

const NATIONALITIES = [
  'مصري', 'سعودي', 'يمني', 'سوداني', 'سوري', 'بنغلاديشي',
  'هندي', 'باكستاني', 'فلبيني', 'أفغاني', 'نيبالي',
]

export function WorkerForm({ onSuccess, initialData }: WorkerFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState('')
  const [cropType, setCropType] = useState<'profile' | 'id' | 'residence'>('profile')
  const [profileImg, setProfileImg] = useState<string>('')
  const [idImg, setIdImg] = useState<string>('')
  const [residenceImg, setResidenceImg] = useState<string>('')

  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      nameAr: initialData?.nameAr || '',
      nameEn: initialData?.nameEn || '',
      phone: initialData?.phone || '',
      nationality: initialData?.nationality || '',
      birthDate: initialData?.birthDate || '',
      joinDate: initialData?.joinDate || new Date().toISOString().split('T')[0],
      baseSalary: initialData?.baseSalary || '0',
      foodAllowance: initialData?.foodAllowance || '0',
      residenceNumber: initialData?.residenceNumber || '',
      residenceExpiry: initialData?.residenceExpiry || '',
      idNumber: initialData?.idNumber || '',
      idExpiry: initialData?.idExpiry || '',
      licenseNumber: initialData?.licenseNumber || '',
      licenseExpiry: initialData?.licenseExpiry || '',
      status: initialData?.status || 'ACTIVE',
      notes: initialData?.notes || '',
    },
  })

  const handleOCRScan = (data: ExtractedData) => {
    if (data.nameAr) form.setValue('nameAr', data.nameAr)
    if (data.nameEn) form.setValue('nameEn', data.nameEn)
    if (data.idNumber) form.setValue('idNumber', data.idNumber)
    if (data.birthDate) form.setValue('birthDate', data.birthDate)
    if (data.expiryDate) form.setValue('idExpiry', data.expiryDate)
    toast.success('تم استخراج البيانات بنجاح')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'id' | 'residence') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string)
      setCropType(type)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (blob: Blob, croppedImageUrl: string) => {
    // Convert blob to base64 for storage
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      if (cropType === 'profile') setProfileImg(base64)
      else if (cropType === 'id') setIdImg(base64)
      else if (cropType === 'residence') setResidenceImg(base64)
    }
    reader.readAsDataURL(blob)
    setShowCropper(false)
  }

  const onSubmit = async (data: WorkerFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          baseSalary: parseFloat(data.baseSalary),
          foodAllowance: parseFloat(data.foodAllowance),
          profileImg,
          idImg,
          residenceImg,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create worker')
      }

      toast.success('تم إضافة العامل بنجاح')
      form.reset()
      setProfileImg('')
      setIdImg('')
      setResidenceImg('')
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Photos Section */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Profile Photo */}
            <div className="space-y-2">
              <Label className="text-slate-300">صورة البروفايل</Label>
              <div className="relative aspect-square bg-slate-900 rounded-lg overflow-hidden border-2 border-dashed border-slate-700">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-8 w-8 text-slate-600" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* ID Card */}
            <div className="space-y-2">
              <Label className="text-slate-300">صورة الهوية</Label>
              <div className="relative aspect-[1.585/1] bg-slate-900 rounded-lg overflow-hidden border-2 border-dashed border-slate-700">
                {idImg ? (
                  <img src={idImg} alt="ID" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-2">
                    <Upload className="h-6 w-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-600">85.6×54mm</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'id')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Residence Card */}
            <div className="space-y-2">
              <Label className="text-slate-300">صورة الإقامة</Label>
              <div className="relative aspect-[1.585/1] bg-slate-900 rounded-lg overflow-hidden border-2 border-dashed border-slate-700">
                {residenceImg ? (
                  <img src={residenceImg} alt="Residence" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-2">
                    <Upload className="h-6 w-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-600">85.6×54mm</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'residence')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* OCR Scanner */}
          <div className="border border-slate-700 rounded-lg p-4">
            <Label className="text-slate-300 block mb-2">أو مسح بطاقة الهوية/الإقامة</Label>
            <OCRScanner onTextExtracted={handleOCRScan} />
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">البيانات الشخصية</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">الاسم (عربي)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="الاسم الكامل بالعربية"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">الاسم (إنجليزي)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name in English"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">رقم الهوية</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10 أرقام"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="05xxxxxxxx"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">الجنسية</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="اختر الجنسية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NATIONALITIES.map((nat) => (
                          <SelectItem key={nat} value={nat}>
                            {nat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* IDs & Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">المستندات</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="residenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">رقم الإقامة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="رقم الإقامة"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="residenceExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">انتهاء الإقامة</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">انتهاء الهوية</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">رقم الرخصة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="رقم رخصة القيادة"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">انتهاء الرخصة</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Salary & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">الراتب والحالة</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="baseSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">الراتب الأساسي</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foodAllowance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">بدل الطعام</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">الحالة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">نشط</SelectItem>
                        <SelectItem value="INACTIVE">غير نشط</SelectItem>
                        <SelectItem value="SUSPENDED">موقوف</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">تاريخ الانضمام</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-800 border-slate-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">ملاحظات</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="أي ملاحظات إضافية..."
                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ العامل'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="border-slate-600"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Form>

      {/* Image Cropper Dialog */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl">
            <ImageCropper
              imageSrc={cropImageSrc}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
              aspectRatio={cropType === 'profile' ? 1 : 1.585}
              circular={cropType === 'profile'}
            />
          </div>
        </div>
      )}
    </>
  )
}
