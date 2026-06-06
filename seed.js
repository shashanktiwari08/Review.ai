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

// ─── Demo Account: Dev Caterers ──────────────────────────────────────────────
export const SEED_USERS = [
  {
    id: 'u_dev',
    name: 'Dev Sharma',
    email: 'dev@caterers.com',
    password: 'dev',
    phone: '+91 93543 84835',
    plan: 'pro',
    registeredAt: now - 86400000 * 25,
    paymentStatus: 'paid',
    totalPaid: 5999
  }
]

export const SEED_BUSINESSES = [
  {
    id: 'b_dev',
    userId: 'u_dev',
    name: 'Dev Caterers',
    category: 'Restaurant / Cafe',
    services: ['Catering', 'Event Buffet', 'Birthday Parties', 'Corporate Dinners'],
    location: 'Rohini, Delhi',
    shortId: 'devcater',
    googleUrl: 'https://share.google/n2O1wAHpv4QyvWDZl',
    keywords: {
      primary_keywords: ['best catering in Delhi', 'wedding catering Rohini', 'top event food'],
      secondary_keywords: ['delicious buffet', 'polite staff', 'hygienic food prep'],
      geo_keywords: ['Delhi', 'Rohini'],
      service_keywords: ['catering', 'buffet', 'parties']
    }
  }
]

// Seed some initial analytics metrics
export const SEED_SCANS = Array.from({ length: 114 }, (_, i) => ({
  id: `sc_dev_${i}`,
  businessId: 'b_dev',
  time: now - Math.random() * 86400000 * 25,
  converted: Math.random() > 0.45
}))

export const SEED_REVIEWS = [
  {
    id: 'rv_dev_1',
    businessId: 'b_dev',
    text: 'Easily the best catering in Delhi! Dev Caterers managed our corporate event in Rohini perfectly. The delicious buffet was praised by all guests. Highly recommend their polite staff.',
    rating: 5,
    time: now - 86400000 * 5,
    images: []
  },
  {
    id: 'rv_dev_2',
    businessId: 'b_dev',
    text: 'Booked them for a wedding catering Rohini function. Excellent food, top event food quality, and hygienic food prep. The layout was very professional.',
    rating: 5,
    time: now - 86400000 * 12,
    images: []
  },
  {
    id: 'rv_dev_3',
    businessId: 'b_dev',
    text: 'Decent buffet for our birthday party. Food was hot and fresh. Service was a bit slow initially, but overall very happy.',
    rating: 4,
    time: now - 86400000 * 18,
    images: []
  }
]

export const SEED_PAYMENTS = [
  {
    id: 'inv_dev_1',
    userId: 'u_dev',
    amount: 5999,
    plan: 'pro',
    date: now - 86400000 * 25,
    status: 'success'
  }
]
