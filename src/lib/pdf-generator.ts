import jsPDF from 'jspdf'
import { formatCurrency, formatDate } from './utils'

export class PDFGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
  }

  // Invoice PDF
  generateInvoice(data: {
    invoiceNumber: string
    clientName: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    date: Date
  }) {
    const { doc } = this
    let y = 20

    // Header
    doc.setFontSize(20)
    doc.text('Invoice', 105, y, { align: 'center' })
    y += 15

    // Invoice Info
    doc.setFontSize(12)
    doc.text(`Invoice No: ${data.invoiceNumber}`, 20, y)
    y += 8
    doc.text(`Date: ${formatDate(data.date)}`, 20, y)
    y += 8
    doc.text(`Client: ${data.clientName}`, 20, y)
    y += 15

    // Table Header
    doc.setFillColor(59, 130, 246)
    doc.rect(20, y, 170, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text('Item', 25, y + 7)
    doc.text('Qty', 80, y + 7)
    doc.text('Price', 120, y + 7)
    doc.text('Total', 160, y + 7)

    // Table Rows
    doc.setTextColor(0, 0, 0)
    y += 15
    data.items.forEach((item) => {
      doc.text(item.name, 25, y)
      doc.text(item.quantity.toString(), 80, y)
      doc.text(formatCurrency(item.price), 120, y)
      doc.text(formatCurrency(item.quantity * item.price), 160, y)
      y += 8
    })

    // Total
    y += 10
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(`Total: ${formatCurrency(data.total)}`, 170, y, { align: 'right' })

    return doc
  }

  // Salary Slip PDF
  generateSalarySlip(data: {
    workerName: string
    month: string
    basicSalary: number
    allowances: number
    deductions: number
    netSalary: number
  }) {
    const { doc } = this
    let y = 20

    doc.setFontSize(18)
    doc.text('Salary Slip', 105, y, { align: 'center' })
    y += 15

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(`Employee: ${data.workerName}`, 20, y)
    y += 8
    doc.text(`Month: ${data.month}`, 20, y)
    y += 15

    // Salary Details
    const details = [
      ['Basic Salary', formatCurrency(data.basicSalary)],
      ['Allowances', formatCurrency(data.allowances)],
      ['Deductions', formatCurrency(data.deductions)],
      ['Net Salary', formatCurrency(data.netSalary)],
    ]

    details.forEach(([label, value]) => {
      doc.text(label, 40, y)
      doc.text(value, 150, y)
      y += 10
    })

    return doc
  }

  save(filename: string) {
    this.doc.save(filename)
  }

  output() {
    return this.doc.output()
  }
}
