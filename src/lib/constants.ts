// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  ENGINEER: 'engineer',
  EMPLOYEE: 'employee',
} as const

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const

// Equipment Status
export const EQUIPMENT_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
} as const

// Worker Status
export const WORKER_STATUS = {
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
} as const

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  OVERDUE: 'overdue',
} as const

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
} as const

// Arabic Labels
export const STATUS_LABELS: Record<string, string> = {
  PLANNING: 'التخطيط',
  ACTIVE: 'نشط',
  PAUSED: 'مؤجل',
  COMPLETED: 'مكتمل',
  planning: 'التخطيط',
  active: 'نشط',
  paused: 'مؤجل',
  completed: 'مكتمل',
  available: 'متاح',
  in_use: 'قيد الاستخدام',
  maintenance: 'صيانة',
  out_of_service: 'خارج الخدمة',
  on_leave: 'في إجازة',
  terminated: 'منتهي خدمته',
  pending: 'معلق',
  paid: 'مدفوع',
  partially_paid: 'مدفوع جزئياً',
  overdue: 'متأخر',
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  half_day: 'نصف يوم',
}

// Navigation Links
export const NAV_LINKS = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: 'LayoutDashboard' },
  { href: '/projects', label: 'المشاريع', icon: 'Building2' },
  { href: '/workers', label: 'العاملين', icon: 'Users' },
  { href: '/equipment', label: 'المعدات', icon: 'Truck' },
  { href: '/maintenance', label: 'الصيانة', icon: 'Wrench' },
  { href: '/spare-parts', label: 'قطع الغيار', icon: 'Cog' },
  { href: '/expenses', label: 'المصروفات', icon: 'ArrowDownCircle' },
  { href: '/revenues', label: 'الإيرادات', icon: 'ArrowUpCircle' },
  { href: '/quotations', label: 'العروض السعرية', icon: 'FileText' },
  { href: '/clients', label: 'العملاء', icon: 'UserCheck' },
  { href: '/suppliers', label: 'الموردين', icon: 'ShoppingCart' },
  { href: '/housing', label: 'السكن العمالي', icon: 'Home' },
  { href: '/attendance', label: 'الحضور والانصراف', icon: 'Clock' },
  { href: '/reports', label: 'التقارير', icon: 'BarChart3' },
  { href: '/settings', label: 'الإعدادات', icon: 'Settings' },
]
