export const resortReceipts = [
  {
    id: 'receipt-1029',
    invoiceNumber: 'INV-1029',
    stayLabel: 'Overnight Family Package',
    issuedDate: '2026-04-08',
    amountPaid: 3300,
    paymentMethod: 'Cash on arrival',
    paymentStatus: 'paid',
    guestName: 'Family Reservation',
    billingAddress: 'MuniMuni Resort Front Desk Billing',
    lineItems: [
      { id: 'room', label: 'Family room package', quantity: 1, unitPrice: 2600 },
      { id: 'meal', label: 'Breakfast buffet add-on', quantity: 2, unitPrice: 300 },
      { id: 'kayak', label: 'Kayak rental', quantity: 1, unitPrice: 250 },
    ],
    serviceFee: 200,
    discount: 150,
  },
  {
    id: 'receipt-1024',
    invoiceNumber: 'INV-1024',
    stayLabel: 'Cove Day Tour',
    issuedDate: '2026-03-30',
    amountPaid: 2000,
    paymentMethod: 'GCash',
    paymentStatus: 'paid',
    guestName: 'Day Tour Group',
    billingAddress: 'Online Booking Settlement',
    lineItems: [
      { id: 'tour-pass', label: 'Day tour pass', quantity: 4, unitPrice: 350 },
      { id: 'cottage', label: 'Cottage rental', quantity: 1, unitPrice: 450 },
      { id: 'locker', label: 'Locker service', quantity: 2, unitPrice: 80 },
    ],
    serviceFee: 90,
    discount: 100,
  },
  {
    id: 'receipt-1018',
    invoiceNumber: 'INV-1018',
    stayLabel: 'Cliffside Overnight Stay',
    issuedDate: '2026-03-18',
    amountPaid: 5200,
    paymentMethod: 'Bank transfer',
    paymentStatus: 'paid',
    guestName: 'Weekend Couple Stay',
    billingAddress: 'MuniMuni Resort Accounting Office',
    lineItems: [
      { id: 'suite', label: 'Cliffside suite package', quantity: 1, unitPrice: 4100 },
      { id: 'airport', label: 'Airport transfer', quantity: 1, unitPrice: 650 },
      { id: 'dinner', label: 'Dinner service', quantity: 1, unitPrice: 580 },
    ],
    serviceFee: 220,
    discount: 350,
  },
]

function formatCurrency(amount) {
  return `PHP ${Number(amount).toLocaleString()}`
}

function formatDateLabel(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function getReceiptTotals(receipt) {
  const subtotal = receipt.lineItems.reduce((runningTotal, item) => {
    return runningTotal + item.quantity * item.unitPrice
  }, 0)

  const serviceFee = Number(receipt.serviceFee || 0)
  const discount = Number(receipt.discount || 0)
  const grandTotal = subtotal + serviceFee - discount

  return { subtotal, serviceFee, discount, grandTotal }
}

export const defaultWalletData = {
  outstandingBalance: 1850,
  recentReceipts: resortReceipts.map((receipt) => ({
    id: receipt.id,
    invoiceNumber: receipt.invoiceNumber,
    stayLabel: receipt.stayLabel,
    dateLabel: formatDateLabel(receipt.issuedDate),
    amountLabel: formatCurrency(receipt.amountPaid),
    paymentMethod: receipt.paymentMethod,
  })),
}

export function findReceiptById(receiptId) {
  if (!receiptId) return null
  return resortReceipts.find(
    (receipt) => receipt.id === receiptId || receipt.invoiceNumber === receiptId,
  ) || null
}

export function formatReceiptCurrency(amount) {
  return formatCurrency(amount)
}
