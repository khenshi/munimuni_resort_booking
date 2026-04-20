/**
 * Transaction Schema and Utility Functions
 * Defines the standardized Transaction Object and provides localStorage utilities
 */

import { cottages, overnightOffers, dayTourOffers, addOns } from '../../../data/packages'

// Transaction Object Structure
export const createTransaction = ({
  transactionId,
  bookingId,
  timestamp = new Date().toISOString(),
  customerDetails,
  itemizedCosts,
  paymentMethod,
  totalAmount,
  amountPaid = totalAmount,
  amountDue = 0,
  paymentType = 'full',
  status = 'completed'
}) => ({
  transactionId,
  bookingId,
  timestamp,
  customerDetails,
  itemizedCosts, // { room: number, addOns: number, rentals: number }
  paymentMethod,
  totalAmount,
  amountPaid,
  amountDue,
  paymentType,
  status
})

// Utility Functions for localStorage
const STORAGE_KEY = 'munimuni-transactions'

export const saveTransaction = (transaction) => {
  try {
    const existingTransactions = getAllTransactions()
    existingTransactions.push(transaction)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTransactions))
    return true
  } catch (error) {
    console.error('Failed to save transaction:', error)
    return false
  }
}

export const getAllTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to retrieve transactions:', error)
    return []
  }
}

// Helper function to ensure booking has valid itemizedCosts and totalAmount
export const ensureBookingCosts = (booking) => {
  if (!booking.itemizedCosts) {
    // Calculate costs based on propertyName or bookingReference
    let roomCost = 0
    if (booking.propertyName) {
      if (booking.propertyName.toLowerCase().includes('day tour') || booking.propertyName.toLowerCase().includes('day')) {
        roomCost = 1000 // ₱1000 for Day Tour
      } else if (booking.propertyName.toLowerCase().includes('overnight') || booking.propertyName.toLowerCase().includes('night')) {
        roomCost = 2500 // ₱2500 for Overnight
      } else {
        roomCost = 1000 // Default to ₱1000
      }
    } else {
      roomCost = 1000 // Default if no propertyName
    }

    booking.itemizedCosts = {
      room: roomCost,
      addOns: 0,
      rentals: 0
    }
  }

  // Ensure totalAmount is calculated
  booking.totalAmount = (booking.itemizedCosts.room || 0) + 
                       (booking.itemizedCosts.addOns || 0) + 
                       (booking.itemizedCosts.rentals || 0)

  return booking
}

// Helper function to calculate booking costs from official package data
export const calculateBookingCosts = (booking) => {
  if (Number.isFinite(Number(booking?.totalAmount)) && booking?.itemizedCosts) {
    return {
      itemizedCosts: {
        room: Number(booking.itemizedCosts.room) || 0,
        addOns: Number(booking.itemizedCosts.addOns) || 0,
        rentals: Number(booking.itemizedCosts.rentals) || 0,
      },
      totalAmount: Number(booking.totalAmount) || 0,
    }
  }

  let roomCost = 0
  let addOnsCost = 0
  let rentalsCost = 0
  const guestCount = Math.max(1, Number.parseInt(booking?.guests, 10) || Number.parseInt(booking?.guestCount, 10) || 1)

  const selectedOffer = booking?.selectedOffer
  if (selectedOffer?.price) {
    roomCost = Number(selectedOffer.price) || 0
    if (selectedOffer.offerType === 'daytour' && selectedOffer.offerId === 'basic') {
      roomCost = roomCost * guestCount
    }
  }

  // Find room/cottage price
  if (!roomCost) {
    const allPackages = [...cottages, ...overnightOffers, ...dayTourOffers]
    const matchedPackage = allPackages.find(pkg => 
      pkg.name === booking.propertyName || 
      pkg.title === booking.propertyName ||
      pkg.name === booking.title || 
      pkg.title === booking.title
    )
    if (matchedPackage) {
      roomCost = matchedPackage.price
    } else {
      // Fallback to existing or default
      roomCost = booking.itemizedCosts?.room || 0
    }
  }

  // Calculate add-ons cost
  if (booking.selectedAddOns && Array.isArray(booking.selectedAddOns)) {
    addOnsCost = booking.selectedAddOns.reduce((total, addOnId) => {
      const matchedAddOn = addOns.find(addon => addon.id === addOnId || addon.title === addOnId)
      return total + (matchedAddOn ? matchedAddOn.price : 0)
    }, 0)
  } else if (booking.addOns && Array.isArray(booking.addOns)) {
    addOnsCost = booking.addOns.reduce((total, addOnId) => {
      const matchedAddOn = addOns.find(addon => addon.id === addOnId || addon.title === addOnId)
      return total + (matchedAddOn ? matchedAddOn.price : 0)
    }, 0)
  } else {
    addOnsCost = booking.itemizedCosts?.addOns || 0
  }

  // Rentals cost (keep existing or 0)
  rentalsCost = booking.itemizedCosts?.rentals || 0

  const itemizedCosts = {
    room: roomCost,
    addOns: addOnsCost,
    rentals: rentalsCost
  }

  const totalAmount = roomCost + addOnsCost + rentalsCost

  return { itemizedCosts, totalAmount }
}

export const getTransactionById = (transactionId) => {
  const transactions = getAllTransactions()
  return transactions.find(t => t.transactionId === transactionId)
}

export const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
