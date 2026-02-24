'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Download, Loader2 } from 'lucide-react'
import { PDFGenerator } from '@/lib/pdf-generator'

interface InvoicePDFProps {
  data: {
    invoiceNumber: string
    clientName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    date: Date
  }
}

export function InvoicePDF({ data }: InvoicePDFProps) {
  const [generating, setGenerating] = useState(false)

  const handleGeneratePDF = () => {
    setGenerating(true)
    try {
      const generator = new PDFGenerator()
      generator.generateInvoice(data)
      generator.save(`invoice-${data.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('PDF generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 rounded-lg">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">فاتورة رقم {data.invoiceNumber}</p>
              <p className="text-sm text-slate-400">{data.clientName}</p>
            </div>
          </div>
          <Button
            onClick={handleGeneratePDF}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            تصدير PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
