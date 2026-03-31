export const cottages = [
  {
    id: 'cove',
    name: 'Cove',
    rate: 'PHP 2,000',
    pax: '10-15 pax',
    details: [
      'Recommended for small group day tours.',
      'Grilling is allowed once this cottage is rented.',
      'Best choice for groups that want a shaded rest area near common facilities.',
    ],
  },
  {
    id: 'jungle',
    name: 'Jungle',
    rate: 'PHP 1,800',
    pax: '10-15 pax',
    details: [
      'Value-friendly option for group outings.',
      'Grilling is allowed once this cottage is rented.',
      'Suitable for barkada and family groups with a similar pax range.',
    ],
  },
  {
    id: 'cliffside',
    name: 'Cliffside',
    rate: 'PHP 3,500',
    pax: '20-30 pax',
    details: [
      'Best for larger gatherings and celebrations.',
      'Grilling is allowed once this cottage is rented.',
      'Spacious setup for groups needing bigger shared space.',
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
    title: 'Overnight Cottage Stay',
    description: 'Ideal for guests who want a private stay space with overnight access.',
  },
  {
    title: 'Overnight Family Package',
    description: 'Designed for family groups with bundled overnight inclusions.',
  },
  {
    title: 'Overnight Barkada Package',
    description: 'Best for friends looking for an extended resort stay.',
  },
]

export const addOns = [
  {
    title: 'Extra Table and Chair Set',
    description: 'Additional seating setup for bigger groups.',
  },
  {
    title: 'Grilling Setup Add-On',
    description: 'Available when paired with an eligible cottage booking.',
  },
  {
    title: 'Floating Table',
    description: 'Great for photos, snacks, and lounge moments.',
  },
  {
    title: 'Videoke / Sound Add-On',
    description: 'Available in approved areas and time slots.',
  },
]
