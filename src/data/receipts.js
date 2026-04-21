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

export function formatReceiptCurrency(amount) {
  return formatCurrency(amount)
}
