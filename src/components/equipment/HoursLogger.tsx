'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, Save } from 'lucide-react'

interface HoursLoggerProps {
  equipmentName: string
  currentHours: number
  onHoursUpdate: (hours: number) => void
}

export function HoursLogger({ equipmentName, currentHours, onHoursUpdate }: HoursLoggerProps) {
  const [hoursToAdd, setHoursToAdd] = useState<number>(0)
  const [newTotal, setNewTotal] = useState<number>(currentHours)

  const handleSave = () => {
    const total = newTotal + hoursToAdd
    setNewTotal(total)
    onHoursUpdate(total)
    setHoursToAdd(0)
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          تسجيل ساعات العمل - {equipmentName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Hours */}
        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
          <span className="text-slate-400">الساعات الحالية:</span>
          <span className="text-2xl font-bold text-white">{currentHours}</span>
        </div>

        {/* Add Hours Input */}
        <div className="space-y-2">
          <Label htmlFor="hoursToAdd">إضافة ساعات:</Label>
          <Input
            id="hoursToAdd"
            type="number"
            min="0"
            step="0.5"
            value={hoursToAdd}
            onChange={(e) => setHoursToAdd(parseFloat(e.target.value) || 0)}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {/* New Total Preview */}
        {hoursToAdd > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <span className="text-slate-300">الإجمالي الجديد:</span>
            <span className="text-xl font-bold text-blue-400">
              {currentHours + hoursToAdd}
            </span>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={hoursToAdd <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </Button>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 8].map((hours) => (
            <Button
              key={hours}
              variant="outline"
              size="sm"
              onClick={() => setHoursToAdd(hoursToAdd + hours)}
              className="border-slate-600"
            >
              +{hours}س
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
