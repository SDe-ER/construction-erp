import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

export const registerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  role: z.enum(['admin', 'manager', 'accountant', 'engineer', 'employee']),
})

// Project Schemas
export const projectSchema = z.object({
  name: z.string().min(3, 'اسم المشروع مطلوب'),
  code: z.string().min(2, 'كود المشروع مطلوب'),
  clientId: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().positive('الميزانية يجب أن تكون رقماً موجباً'),
  status: z.enum(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']),
  description: z.string().optional(),
})

// Worker Schemas
export const workerSchema = z.object({
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().optional(),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  nationality: z.string().optional(),
  birthDate: z.string().optional(),
  joinDate: z.string().min(1, 'تاريخ الانضمام مطلوب'),
  baseSalary: z.number().min(0, 'الراتب الأساسي مطلوب'),
  foodAllowance: z.number().default(0),
  residenceNumber: z.string().optional(),
  residenceExpiry: z.string().optional(),
  idNumber: z.string().min(1, 'رقم الهوية مطلوب'),
  idExpiry: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  residenceImg: z.string().optional(),
  idImg: z.string().optional(),
  profileImg: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  notes: z.string().optional(),
})

// Equipment Schemas
export const equipmentSchema = z.object({
  name: z.string().min(3, 'اسم المعدة مطلوب'),
  code: z.string().min(2, 'كود المعدة مطلوب'),
  type: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseCost: z.number().positive('تكلفة الشراء يجب أن تكون رقماً موجباً'),
  currentHours: z.number().default(0),
  status: z.enum(['available', 'in_use', 'maintenance', 'out_of_service']),
})

// Expense Schemas
export const expenseSchema = z.object({
  title: z.string().min(3, 'عنوان المصروف مطلوب'),
  amount: z.number().positive('المبلغ يجب أن يكون رقماً موجباً'),
  category: z.string().optional(),
  projectId: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
})

// Revenue Schemas
export const revenueSchema = z.object({
  title: z.string().min(3, 'عنوان الإيراد مطلوب'),
  amount: z.number().positive('المبلغ يجب أن يكون رقماً موجباً'),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(['pending', 'paid', 'partially_paid', 'overdue']),
})
