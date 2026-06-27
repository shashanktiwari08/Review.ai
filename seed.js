// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE = {
  users: 'reviewai_users',
  businesses: 'reviewai_businesses',
  scans: 'reviewai_scans',
  reviews: 'reviewai_reviews',
  payments: 'reviewai_payments',
  currentUser: 'reviewai_current_user',
}

const now = Date.now()
const day = 86400000

// ─── Demo Account: Dev Caterers ──────────────────────────────────────────────
export const SEED_USERS = [
  {
    id: 'u_dev',
    name: 'Dev Sharma',
    email: 'dev@caterers.com',
    password: 'dev',
    phone: '+91 93543 84835',
    plan: 'pro',
    registeredAt: now - day * 25,
    paymentStatus: 'paid',
    totalPaid: 5999
  },
  // Additional demo clients for owner analytics
  {
    id: 'u_mehta',
    name: 'Priya Mehta',
    email: 'priya@mehtadental.com',
    password: 'mehta123',
    phone: '+91 98101 23456',
    plan: 'pro',
    registeredAt: now - day * 60,
    paymentStatus: 'paid',
    totalPaid: 5999
  },
  {
    id: 'u_raj',
    name: 'Rajesh Kumar',
    email: 'rajesh@rajhotels.in',
    password: 'raj123',
    phone: '+91 87654 32109',
    plan: 'starter',
    registeredAt: now - day * 45,
    paymentStatus: 'paid',
    totalPaid: 3999
  },
  {
    id: 'u_nisha',
    name: 'Nisha Gupta',
    email: 'nisha@guptarestaurant.com',
    password: 'nisha123',
    phone: '+91 76543 21098',
    plan: 'pro',
    registeredAt: now - day * 15,
    paymentStatus: 'paid',
    totalPaid: 5999
  },
  {
    id: 'u_arun',
    name: 'Arun Singh',
    email: 'arun@arungym.in',
    password: 'arun123',
    phone: '+91 96543 78901',
    plan: 'starter',
    registeredAt: now - day * 8,
    paymentStatus: 'paid',
    totalPaid: 3999
  },
  {
    id: 'u_sunita',
    name: 'Sunita Verma',
    email: 'sunita@beautysalon.com',
    password: 'sunita123',
    phone: '+91 85432 67890',
    plan: 'pro',
    registeredAt: now - day * 90,
    paymentStatus: 'paid',
    totalPaid: 5999
  },
  {
    id: 'u_vikram',
    name: 'Vikram Patel',
    email: 'vikram@patelbakery.in',
    password: 'vikram123',
    phone: '+91 94321 56789',
    plan: 'starter',
    registeredAt: now - day * 3,
    paymentStatus: 'paid',
    totalPaid: 3999
  },
]

export const SEED_BUSINESSES = [
  {
    id: 'b_dev',
    userId: 'u_dev',
    name: 'Dev Caterers',
    category: 'Restaurant / Cafe',
    services: ['Catering', 'Event Buffet', 'Birthday Parties', 'Corporate Dinners'],
    location: 'Dwarka, Delhi',
    shortId: 'devcater',
    googleUrl: 'https://g.page/r/CZGkiXIfz3cDEBM/review',
    keywords: {
      primary_keywords: ['best catering in Delhi', 'wedding catering Dwarka', 'top event food'],
      secondary_keywords: ['delicious buffet', 'polite staff', 'hygienic food prep'],
      geo_keywords: ['Delhi', 'Dwarka'],
      service_keywords: ['catering', 'buffet', 'parties']
    }
  },
  {
    id: 'b_mehta',
    userId: 'u_mehta',
    name: 'Mehta Dental Clinic',
    category: 'Healthcare',
    services: ['Teeth Whitening', 'Root Canal', 'Dental Implants', 'Braces'],
    location: 'Rohini, Delhi',
    shortId: 'mehtadnt',
    googleUrl: 'https://g.page/r/sample/review',
    keywords: {
      primary_keywords: ['best dental clinic Rohini', 'painless root canal Delhi'],
      secondary_keywords: ['friendly dentist', 'clean clinic', 'affordable dental care'],
      geo_keywords: ['Delhi', 'Rohini'],
      service_keywords: ['dentist', 'dental clinic', 'braces']
    }
  },
  {
    id: 'b_raj',
    userId: 'u_raj',
    name: 'Raj Grand Hotel',
    category: 'Hotel',
    services: ['Rooms', 'Conference Hall', 'Restaurant', 'Banquet'],
    location: 'Connaught Place, Delhi',
    shortId: 'rajhotel',
    googleUrl: 'https://g.page/r/sample2/review',
    keywords: {
      primary_keywords: ['best hotel Connaught Place', 'luxury stay Delhi'],
      secondary_keywords: ['excellent hospitality', 'clean rooms', 'central location'],
      geo_keywords: ['Delhi', 'Connaught Place'],
      service_keywords: ['hotel', 'rooms', 'banquet']
    }
  },
  {
    id: 'b_nisha',
    userId: 'u_nisha',
    name: 'Gupta Family Restaurant',
    category: 'Restaurant / Cafe',
    services: ['North Indian Cuisine', 'Thali', 'Party Orders', 'Home Delivery'],
    location: 'Lajpat Nagar, Delhi',
    shortId: 'guptrest',
    googleUrl: 'https://g.page/r/sample3/review',
    keywords: {
      primary_keywords: ['best restaurant Lajpat Nagar', 'authentic north Indian food Delhi'],
      secondary_keywords: ['delicious thali', 'family dining', 'affordable meal'],
      geo_keywords: ['Delhi', 'Lajpat Nagar'],
      service_keywords: ['restaurant', 'thali', 'delivery']
    }
  },
  {
    id: 'b_arun',
    userId: 'u_arun',
    name: 'Arun Fitness Studio',
    category: 'Gym / Fitness',
    services: ['Personal Training', 'Yoga', 'Zumba', 'CrossFit'],
    location: 'Vasant Kunj, Delhi',
    shortId: 'arunfit',
    googleUrl: 'https://g.page/r/sample4/review',
    keywords: {
      primary_keywords: ['best gym Vasant Kunj', 'personal trainer Delhi'],
      secondary_keywords: ['modern equipment', 'friendly trainers', 'clean gym'],
      geo_keywords: ['Delhi', 'Vasant Kunj'],
      service_keywords: ['gym', 'fitness', 'yoga', 'crossfit']
    }
  },
  {
    id: 'b_sunita',
    userId: 'u_sunita',
    name: 'Sunita Beauty Parlour',
    category: 'Beauty / Salon',
    services: ['Hair Treatment', 'Facial', 'Waxing', 'Bridal Makeup'],
    location: 'Janakpuri, Delhi',
    shortId: 'sunitabl',
    googleUrl: 'https://g.page/r/sample5/review',
    keywords: {
      primary_keywords: ['best beauty parlour Janakpuri', 'bridal makeup artist Delhi'],
      secondary_keywords: ['skilled beauticians', 'hygienic salon', 'affordable services'],
      geo_keywords: ['Delhi', 'Janakpuri'],
      service_keywords: ['salon', 'makeup', 'facial', 'hair']
    }
  },
  {
    id: 'b_vikram',
    userId: 'u_vikram',
    name: 'Patel Fresh Bakery',
    category: 'Bakery / Cafe',
    services: ['Fresh Bread', 'Cakes', 'Pastries', 'Custom Orders'],
    location: 'Pitampura, Delhi',
    shortId: 'patelbkr',
    googleUrl: 'https://g.page/r/sample6/review',
    keywords: {
      primary_keywords: ['best bakery Pitampura', 'fresh bread cakes Delhi'],
      secondary_keywords: ['eggless options', 'custom cakes', 'daily fresh baked'],
      geo_keywords: ['Delhi', 'Pitampura'],
      service_keywords: ['bakery', 'cakes', 'pastries', 'bread']
    }
  },
]

// Seed some initial analytics metrics
const baseTime = 1780760570426; // Stable June 2026 baseline
export const SEED_SCANS = Array.from({ length: 114 }, (_, i) => {
  const timeOffset = ((i * 12345) % 25) * day + ((i * 6789) % day);
  const isConverted = (i * 7 + 3) % 10 < 6;
  return {
    id: `sc_dev_${i}`,
    businessId: 'b_dev',
    time: baseTime - timeOffset,
    converted: isConverted
  }
})

export const SEED_REVIEWS = [
  {
    id: 'rv_dev_1',
    businessId: 'b_dev',
    text: 'Easily the best catering in Delhi! Dev Caterers managed our corporate event in Dwarka perfectly. The delicious buffet was praised by all guests. Highly recommend their polite staff.',
    rating: 5,
    time: baseTime - day * 5,
    images: []
  },
  {
    id: 'rv_dev_2',
    businessId: 'b_dev',
    text: 'Booked them for a wedding catering Dwarka function. Excellent food, top event food quality, and hygienic food prep. The layout was very professional.',
    rating: 5,
    time: baseTime - day * 12,
    images: []
  },
  {
    id: 'rv_dev_3',
    businessId: 'b_dev',
    text: 'Decent buffet for our birthday party. Food was hot and fresh. Service was a bit slow initially, but overall very happy.',
    rating: 4,
    time: baseTime - day * 18,
    images: []
  }
]

export const SEED_PAYMENTS = [
  // Dev Caterers - pro plan (current + renewal)
  {
    id: 'inv_dev_1',
    userId: 'u_dev',
    businessId: 'b_dev',
    businessName: 'Dev Caterers',
    amount: 5999,
    plan: 'pro',
    date: now - day * 25,
    status: 'success'
  },
  // Mehta Dental - pro plan (2 months)
  {
    id: 'inv_mehta_1',
    userId: 'u_mehta',
    businessId: 'b_mehta',
    businessName: 'Mehta Dental Clinic',
    amount: 5999,
    plan: 'pro',
    date: now - day * 60,
    status: 'success'
  },
  {
    id: 'inv_mehta_2',
    userId: 'u_mehta',
    businessId: 'b_mehta',
    businessName: 'Mehta Dental Clinic',
    amount: 5999,
    plan: 'pro',
    date: now - day * 30,
    status: 'success'
  },
  // Raj Grand Hotel - starter plan
  {
    id: 'inv_raj_1',
    userId: 'u_raj',
    businessId: 'b_raj',
    businessName: 'Raj Grand Hotel',
    amount: 3999,
    plan: 'starter',
    date: now - day * 45,
    status: 'success'
  },
  // Gupta Restaurant - pro plan
  {
    id: 'inv_nisha_1',
    userId: 'u_nisha',
    businessId: 'b_nisha',
    businessName: 'Gupta Family Restaurant',
    amount: 5999,
    plan: 'pro',
    date: now - day * 15,
    status: 'success'
  },
  // Arun Fitness - starter plan
  {
    id: 'inv_arun_1',
    userId: 'u_arun',
    businessId: 'b_arun',
    businessName: 'Arun Fitness Studio',
    amount: 3999,
    plan: 'starter',
    date: now - day * 8,
    status: 'success'
  },
  // Sunita Beauty - pro plan (3 months - loyal customer)
  {
    id: 'inv_sunita_1',
    userId: 'u_sunita',
    businessId: 'b_sunita',
    businessName: 'Sunita Beauty Parlour',
    amount: 5999,
    plan: 'pro',
    date: now - day * 90,
    status: 'success'
  },
  {
    id: 'inv_sunita_2',
    userId: 'u_sunita',
    businessId: 'b_sunita',
    businessName: 'Sunita Beauty Parlour',
    amount: 5999,
    plan: 'pro',
    date: now - day * 60,
    status: 'success'
  },
  {
    id: 'inv_sunita_3',
    userId: 'u_sunita',
    businessId: 'b_sunita',
    businessName: 'Sunita Beauty Parlour',
    amount: 5999,
    plan: 'pro',
    date: now - day * 30,
    status: 'success'
  },
  // Patel Bakery - starter plan
  {
    id: 'inv_vikram_1',
    userId: 'u_vikram',
    businessId: 'b_vikram',
    businessName: 'Patel Fresh Bakery',
    amount: 3999,
    plan: 'starter',
    date: now - day * 3,
    status: 'success'
  },
]
