'use client'

import { Worker } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

interface SalaryTableProps {
  workers: Worker[]
  month: string
  year: number
}

export function SalaryTable({ workers, month, year }: SalaryTableProps) {
  const totalSalaries = workers.reduce((sum, worker) => sum + worker.salary, 0)
  const activeWorkers = workers.filter(w => w.status === 'active').length

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">كشف الرواتب</CardTitle>
          <div className="flex gap-4 text-sm">
            <div className="text-slate-400">
              العدد: <span className="text-white font-bold">{activeWorkers}</span>
            </div>
            <div className="text-slate-400">
              الإجمالي: <span className="text-green-400 font-bold">{formatCurrency(totalSalaries)}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400">{month} {year}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableHead className="text-slate-300">#</TableHead>
              <TableHead className="text-slate-300">اسم العامل</TableHead>
              <TableHead className="text-slate-300">الوظيفة</TableHead>
              <TableHead className="text-slate-300">الراتب الأساسي</TableHead>
              <TableHead className="text-slate-300">البدايل</TableHead>
              <TableHead className="text-slate-300">الخصومات</TableHead>
              <TableHead className="text-slate-300">صافي الراتب</TableHead>
              <TableHead className="text-slate-300">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker, index) => {
              const allowances = worker.allowances || 0
              const deductions = worker.deductions || 0
              const netSalary = worker.salary + allowances - deductions

              return (
                <TableRow key={worker.id} className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell className="text-slate-300">{index + 1}</TableCell>
                  <TableCell className="text-white font-medium">{worker.name}</TableCell>
                  <TableCell className="text-slate-300">{worker.position || '-'}</TableCell>
                  <TableCell className="text-slate-300">{formatCurrency(worker.salary)}</TableCell>
                  <TableCell className="text-green-400">+{formatCurrency(allowances)}</TableCell>
                  <TableCell className="text-red-400">-{formatCurrency(deductions)}</TableCell>
                  <TableCell className="text-white font-bold">{formatCurrency(netSalary)}</TableCell>
                  <TableCell>
                    <Badge
                      className={worker.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
                      variant="outline"
                    >
                      {worker.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
