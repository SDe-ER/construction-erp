// User Types
export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: Date
  updatedAt: Date
}

// Worker Types
export interface Worker {
  id: string
  nameAr: string
  nameEn?: string
  phone: string
  nationality?: string
  birthDate?: Date
  joinDate: Date
  baseSalary: number
  foodAllowance: number
  residenceNumber?: string
  residenceExpiry?: Date
  idNumber: string
  idExpiry?: Date
  licenseNumber?: string
  licenseExpiry?: Date
  residenceImg?: string
  idImg?: string
  profileImg?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  rating: number
  notes?: string
  avatar?: string
  allowances?: number
  deductions?: number
  housing?: string
  createdAt: Date
  updatedAt: Date
}

// Project Types
export interface Project {
  id: string
  name: string
  code: string
  clientId?: string
  startDate: Date
  endDate?: Date
  status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'
  pricingType: 'HOURLY' | 'METER'
  description?: string
  budget?: number
  notes?: string
  progress?: number
  location?: string
  createdAt: Date
  updatedAt: Date
}

// Equipment Types
export interface Equipment {
  id: string
  name: string
  type: string
  model?: string
  serialNumber?: string
  manufactureYear?: number
  ownerId?: string
  ownerType: 'COMPANY' | 'BROTHER' | 'RENTAL'
  status: 'WORKING' | 'MAINTENANCE' | 'IDLE' | 'RENTED'
  currentMeter: number
  purchasePrice?: number
  image?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Client Types
export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  company?: string
  address?: string
  notes?: string
  createdAt: Date
}

// Expense Types
export interface Expense {
  id: string
  projectId?: string
  equipmentId?: string
  categoryId: string
  amount: number
  taxAmount: number
  taxIncluded: boolean
  totalAmount: number
  date: Date
  description?: string
  receiptImg?: string
  paymentMethod: 'CASH' | 'TRANSFER' | 'CHECK'
  createdAt: Date
}

// Revenue Types
export interface Revenue {
  id: string
  projectId: string
  clientId?: string
  invoiceNumber: string
  amount: number
  taxAmount: number
  totalAmount: number
  type: 'METER' | 'HOURLY' | 'TRUCK'
  meters?: number
  hours?: number
  truckCount?: number
  truckSize?: string
  unitPrice: number
  date: Date
  isPaid: boolean
  paidAt?: Date
  notes?: string
  createdAt: Date
}

// Quotation Types
export interface Quotation {
  id: string
  clientId: string
  projectName: string
  items: QuotationItem[]
  estimatedCost: number
  sellingPrice: number
  profitMargin: number
  profitAmount: number
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'
  validUntil: Date
  notes?: string
  convertedToProjectId?: string
  createdAt: Date
  updatedAt: Date
}

export interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Housing Types
export interface Housing {
  id: string
  location: string
  monthlyRent: number
  electricityAvg?: number
  waterAvg?: number
  workerIds: string[]
  startDate: Date
  endDate?: Date
  notes?: string
  createdAt: Date
}

// Attendance Types
export interface Attendance {
  id: string
  workerId: string
  date: Date
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE'
  projectId?: string
  notes?: string
  createdAt: Date
}

// Maintenance Types
export interface Maintenance {
  id: string
  equipmentId: string
  type: 'ROUTINE' | 'EMERGENCY' | 'PERIODIC'
  date: Date
  meterAtService: number
  nextServiceMeter?: number
  nextServiceDate?: Date
  cost: number
  technicianName?: string
  description?: string
  filterOil: boolean
  filterFuel: boolean
  filterAir: boolean
  filterHydraulic: boolean
  filterOther?: string
  receipt?: string
  createdAt: Date
}

// Spare Part Types
export interface SparePart {
  id: string
  name: string
  partNumber?: string
  quantity: number
  unit: string
  minQuantity: number
  purchasePrice: number
  totalCost: number
  equipmentId?: string
  projectId?: string
  purchaseDate: Date
  supplier?: string
  receiptImg?: string
  notes?: string
  createdAt: Date
}

// Salary Types
export interface Salary {
  id: string
  workerId: string
  month: number
  year: number
  baseSalary: number
  foodAllowance: number
  overtimeTotal: number
  deductions: number
  absenceDays: number
  absenceDeduction: number
  netSalary: number
  isPaid: boolean
  paidAt?: Date
  notes?: string
  createdAt: Date
}
