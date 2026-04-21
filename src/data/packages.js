import galleryImage1 from '../assets/1.png'
import galleryImage2 from '../assets/2.png'
import galleryImage3 from '../assets/3.png'
import galleryImage4 from '../assets/4.png'
import galleryImage5 from '../assets/5.png'
import galleryImage6 from '../assets/6.png'
import galleryImage7 from '../assets/7.png'
import galleryImage8 from '../assets/8.png'

import cove from '../assets/cove.webp'
import jungle from '../assets/jungle.webp'
import cliffside from '../assets/cliffside.webp'
import seaside from '../assets/seaside.webp'
import veranda from '../assets/veranda.webp'
import cabana from '../assets/cabana.webp'
import alfresco from '../assets/alfresco.webp'

export const cottages = [
  {
    id: 'cove',
    title: 'Cove',
    name: 'Cove',
    price: 2000,
    priceLabel: '₱2,000',
    paxMin: 10,
    paxMax: 15,
    paxLabel: '10-15 pax',
    description: 'Relax by the water and enjoy a refreshing day right by the shore — perfect for groups who want comfort and a stunning sea view.',
    imageUrl: cove,
    alt: 'Cove cottage with ocean-facing lounge area',
    availability: {
      unavailableCheckInDates: ['2026-04-06', '2026-04-12', '2026-04-20'],
    },
    details: [
      'Beach access — Beachfront',
      'Private open cottage with tables and chairs',
      'Day Tour Hours: 8:00 AM – 5:00 PM',
      'Amenities: Pisonet Wifi, Shower and toilet, and Limited free parking',
      'Corkage Fee: ₱50 per person for outside food and drinks (Food/drinks also available on-site)',
      'Reminders: No early check-in, no pets, no tents, and no loud music/karaoke',
      ],
  },
  {
    id: 'jungle',
    title: 'Jungle',
    name: 'Jungle',
    price: 1800,
    priceLabel: '₱1,800',
    paxMin: 10,
    paxMax: 15,
    paxLabel: '10-15 pax',
    description: 'Unwind in a shaded spot by the sea and let the cool breeze wash your worries away — a peaceful escape surrounded by nature.',
    imageUrl: jungle,
    alt: 'Jungle cottage surrounded by trees near the beach',
    availability: {
      unavailableCheckInDates: ['2026-04-06', '2026-04-12', '2026-04-20'],
    },
    details: [
      'Beach access — beachfront',
      'Private open cottage with tables and chairs',
      'Day Tour Hours: 8:00 AM – 5:00 PM',
      'Inclusions: Limited free parking, Pisonet Wifi, Shower and toilet',
      'Corkage Fee: ₱50 per person for outside food and drinks (Food/drinks also available on-site)',
      'Reminders: No early check-in, no loud music/karaoke, no pets, and no tent setups',
    ],
  },
  {
    id: 'cliffside',
    title: 'Cliffside',
    name: 'Cliffside',
    price: 3500,
    priceLabel: '₱3,500',
    paxMin: 20,
    paxMax: 30,
    paxLabel: '20-30 pax',
    description: 'Relax above the sea on our signature overhanging net and feel the ocean breeze beneath you — a serene and scenic spot best enjoyed by adults or older children.',
    imageUrl: cliffside,
    alt: 'Cliffside cottage with overhanging net escape',
    availability: {
      unavailableCheckInDates: ['2026-04-06', '2026-04-12', '2026-04-20'],
    },
    details: [
      'Inclusions: Suspended net above the sea and direct view of the rock formations.',
      'Location: Most secluded area, beachfront access.',
      'Amenities: Private open cottage, tables and chairs, Pisonet Wifi, shower and toilet.',
      'Day Tour Hours: 8:00 AM – 5:00 PM.',
      'Corkage Fee: ₱50 per person for outside food and drinks.',
      'Reminders: No early check-in, no pets, no tents, and no speakers/karaoke.',
    ],
  },
]

export const infoContentByTab = {
  daytour: {
    heading: 'Reminders and General Details',
    reminders: [
      'No early check-in.',
      'No speakers, loud music, or karaoke.',
      'Pets are not allowed.',
      'Tent setups are not permitted (no campsite available).',
      'No kitchen access for day tour guests.',
      'Cooking and grilling are not allowed (grilling is only allowed when a cottage is purchased).',
    ],
    details: [
      'Day tour hours: 8:00 AM to 5:00 PM.',
      'Walk-ins are welcome, subject to availability.',
      'Corkage fee: PHP 50 per person for outside food and drinks.',
      'Food and drinks are also available on-site.',
    ],
  },
  overnight: {
    heading: 'Overnight Reminders and Details',
    reminders: [
      'Check-in and check-out schedules apply by room/cottage type.',
      'Quiet hours are strictly observed for all overnight guests.',
      'Guest count should match your confirmed reservation.',
      'Outside appliances and cooking setups are not allowed unless approved.',
      'Any additional guest is subject to capacity and extra charge policy.',
    ],
    details: [
      'Overnight bookings are reservation-based and subject to room availability.',
      'Package inclusions vary depending on selected overnight offer.',
      'Weekend and holiday rates may differ from weekday rates.',
      'Food and drink options are available on-site.',
    ],
  },
  addons: {
    heading: 'Add-Ons Notes and Details',
    reminders: [
      'Add-ons are subject to availability on your selected date.',
      'Some add-ons require advance reservation and confirmation.',
      'Add-ons may have separate capacity or usage limits.',
      'Add-ons are non-transferable once confirmed.',
    ],
    details: [
      'Add-ons are optional and can be combined with day tour or overnight bookings.',
      'Rates for add-ons are charged on top of your selected package.',
      'Final add-on list and rates are confirmed during reservation processing.',
      'On-site staff can assist with recommended add-ons for your group size.',
    ],
  },
}

export const overnightOffers = [
  {
    id: 'seaside',
    title: 'Seaside',
    price: 2950,
    priceLabel: '₱2,950',
    paxMin: 2,
    paxMax: 2,
    paxLabel: 'Good for 2 guests',
    description: 'An intimate seaside hideaway offering comfort, privacy, and a beautiful view of the beach — perfect for couples seeking a peaceful retreat.',
    imageUrl: seaside,
    alt: 'Seaside Room private escape for two',
    availability: {
      unavailableCheckInDates: ['2026-04-05', '2026-04-11', '2026-04-19'],
    },
    details: [
      'Sleeping Arrangements: 1 Full-Sized Bed.',
      'Inclusions: Air conditioning, Mini refrigerator, 2 Towels, Tables and chairs, and Pisonet Wifi.',
      'Bathroom: Shared shower and toilet (Private shower and toilet not available).',
      'Check-in: 3:00 PM | Check-out: 12:00 PM (Early check-in subject to availability/charges).',
      'Requirements: Present one valid ID and ₱1,000 deposit upon check-in.',
      'Swimming Hours: 8:00 AM – 7:00 PM; No entry past 7:00 PM.',
      'Corkage Fee: ₱50.00 per person for outside food and drink.',
      'Strictly Prohibited: No walk-ins, no pets, no speakers/loud music/karaoke, and no tent setups.',
      'Exclusions: Toiletries and kitchen/grilling facilities are not included.',
    ],
  } ,
  {
    id: 'veranda-room',
    title: 'Veranda',
    price: 2950,
    priceLabel: '₱2,950',
    paxMin: 1,
    paxMax: 6,
    paxLabel: '1-6 guests',
    description: 'A spacious dormitory-style room ideal for groups or families looking to relax together by the beach.',
    imageUrl: veranda,
    alt: 'Veranda Room dormitory-style room for families and barkadas',
    availability: {
      unavailableCheckInDates: ['2026-04-06', '2026-04-12', '2026-04-20'],
    },
    details: [
      'Sleeping Arrangements: 6 Beds (2 Triple Deck Beds).',
      'Inclusions: Air conditioning, Private shower and toilet, Tables and chairs, Pisonet Wifi.',
      'Kitchen: Own kitchen equipped with a pot, ladle, knife, chopping board, serving spoon, and 1 butane canister.',
      'Check-in: 3:00 PM | Check-out: 12:00 PM (Early check-in subject to availability/charges).',
      'Exclusions: Toiletries and Tableware (spoon, fork, plates, cups, etc.) are not included.',
      'Policies: No walk-ins, no entry past 7:00 PM, ₱1,000 deposit and valid ID required upon check-in.',
      'Reminders: Corkage fee ₱50/person for outside food/drinks; No pets, no tents, no speakers/loud music.',
    ],
  },
  {
    id: 'cabana-room',
    title: 'Cabana',
    price: 7500,
    priceLabel: '₱7,500',
    paxMin: 10,
    paxMax: 13,
    paxLabel: '10-13 guests',
    description: 'Enjoy the waves and scenic beauty just steps away from your cozy open-air room, with the ocean right at your doorstep — perfect for groups or families seeking a beachside getaway.',
    imageUrl: cabana,
    alt: 'Cabana Room open-air oceanfront retreat',
    availability: {
      unavailableCheckInDates: ['2026-04-06', '2026-04-12', '2026-04-20'],
    },
    details: [
      'Sleeping Arrangements: 1 Super King Size Bed, 2 Single Beds, 2 Queen Floor Mattresses, and 1 Single Floor Mattress.',
      'Inclusions: Ceiling fans, Water Jug (19L), Tables and chairs, Pisonet Wifi, and Shared shower and toilet.',
      'Kitchen: Own kitchen equipped with a pot, ladle, knife, chopping board, serving spoon, and 1 butane canister.',
      'Check-in: 3:00 PM | Check-out: 12:00 PM (Early check-in subject to availability/charges).',
      'Exclusions: Private shower/toilet, Towels and toiletries, and Tableware (spoon, fork, plates, etc.) are NOT included.',
      'Policies: No walk-ins, no entry past 7:00 PM, ₱1,000 deposit and valid ID required upon check-in.',
      'Reminders: Corkage fee ₱50.00/person for outside food/drinks; No pets, no tents, no speakers/loud music.',
      'Beach Access: Beachfront location with swimming hours from 8:00 AM – 7:00 PM.',
    ],
  },
  {
    id: 'al-fresco-room',
    title: 'Al Fresco',
    price: 13500,
    priceLabel: '₱13,500',
    paxMin: 15,
    paxMax: 18,
    paxLabel: '15-18 guests',
    description: 'Feel the gentle breeze as you indulge in captivating views of the sea — perfect for large groups or families seeking a scenic, relaxing getaway.',
    imageUrl: alfresco,
    alt: 'Al Fresco Room open-air seaside breeze escape',
    availability: {
      unavailableCheckInDates: ['2026-04-06', '2026-04-12', '2026-04-20'],
    },
    details: [
      'Sleeping Arrangements: 12 beds total (8 Twin-Sized Beds and 4 Full-Sized Floor Mattresses).',
      'Inclusions: Hanging swings, Standing fans, Water Jug (19L), Tables and chairs, and Pisonet Wifi.',
      'Kitchen: Own kitchen equipped with a pot, ladle, knife, chopping board, serving spoon, and 1 butane canister.',
      'Bathroom: Shared shower and toilet (Private shower/toilet NOT included).',
      'Check-in: 3:00 PM | Check-out: 12:00 PM (Early check-in subject to availability/charges).',
      'Exclusions: Towels, toiletries, and Tableware (spoon, fork, plates, cups, etc.) are NOT included.',
      'Policies: No walk-ins, no entry past 7:00 PM, ₱1,000 deposit and valid ID required upon check-in.',
      'Reminders: Corkage fee ₱50.00/person for outside food/drinks; No pets, no tents, no speakers/loud music.',
      'Beach Access: Beachfront location with swimming hours from 8:00 AM – 7:00 PM.',
    ],
  },
]

export const dayTourOffers = [
  {
    id: 'basic',
    title: 'Basic Type - Entrance Fee',
    price: 275,
    priceLabel: 'PHP 275 per person',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Any pax',
    description: 'Includes free use of tables and chairs.',
    imageUrl: galleryImage1,
    availability: {
      dailySlotCapacity: 120,
      reservedGuestsByDate: {
        '2026-04-08': 38,
        '2026-04-09': 55,
        '2026-04-10': 74,
        '2026-04-11': 102,
        '2026-04-12': 118,
        '2026-04-13': 46,
        '2026-04-14': 67,
      },
      unavailableCheckInDates: ['2026-04-04', '2026-04-14', '2026-04-24'],
    },
    details: [
      'Day tour access from 8:00 AM to 5:00 PM.',
      'Entrance fee starts at PHP 275 and may vary based on date and guest type.',
      'Free use of shared tables and chairs is included in this option.',
      'Ideal for guests who want flexible resort access without cottage rental.',
      'Cottage rental can be added separately for grilling and dedicated resting space.',
      'Walk-ins are welcome subject to resort capacity and availability.',
    ],
  },
]

export const addOns = [
  {
    id: 'griller-addon',
    title: 'Griller',
    price: 250,
    priceLabel: '₱250',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Any pax',
    description: 'Includes 1 kg charcoal for your BBQ needs.',
    imageUrl: galleryImage6,
    details: [
      'Includes: Griller unit and 1 kg of charcoal.',
      'Perfect for: Groups who want to enjoy a freshly grilled meal by the beach.',
      'Availability: Can be added to cottage rentals.',
    ],
  },
  {
    id: 'water-jug-addon',
    title: 'Water Jug (19L)',
    price: 100,
    priceLabel: '₱100',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Any pax',
    description: 'Large 19L water jug for group hydration.',
    imageUrl: galleryImage4,
    details: [
      'Capacity: 19 Liters.',
      'Ideal for: Ensuring the whole group stays hydrated throughout the day.',
    ],
  },
  {
    id: 'orange-kayak-addon',
    title: 'Orange Kayak',
    price: 600,
    priceLabel: '₱600 / hour',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Per hour',
    description: 'Explore the waters with our premium orange kayak.',
    imageUrl: galleryImage8,
    details: [
      'Rate: ₱600 per hour of use.',
      'Activity: Great for sightseeing and light exercise on the water.',
    ],
  },
  {
    id: 'blue-kayak-addon',
    title: 'Blue Kayak',
    price: 500,
    priceLabel: '₱500 / hour',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Per hour',
    description: 'Standard blue kayak for ocean exploration.',
    imageUrl: galleryImage8,
    details: [
      'Rate: ₱500 per hour of use.',
    ],
  },
  {
    id: 'snorkeling-gear-addon',
    title: 'Snorkeling Gear',
    price: 100,
    priceLabel: '₱100 / hour',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Per hour',
    description: 'Discover the underwater beauty of the cove.',
    imageUrl: galleryImage2,
    details: [
      'Rate: ₱100 per hour.',
      'Includes: Mask and snorkel set.',
    ],
  },
  {
    id: 'life-vest-addon',
    title: 'Life Vest',
    price: 50,
    priceLabel: '₱50 / hour',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Per hour',
    description: 'Essential safety gear for swimming and water activities.',
    imageUrl: galleryImage2,
    details: [
      'Rate: ₱50 per hour.',
      'Safety: Highly recommended for all guests engaging in water sports.',
    ],
  },
  {
    id: 'swimming-noodle-addon',
    title: 'Swimming Noodle',
    price: 50,
    priceLabel: '₱50 / hour',
    paxMin: 1,
    paxMax: null,
    paxLabel: 'Per hour',
    description: 'Fun flotation aid for relaxed swimming.',
    imageUrl: galleryImage2,
    details: [
      'Rate: ₱50 per hour.',
      'Perfect for: Casual lounging in the water.',
    ],
  },
]