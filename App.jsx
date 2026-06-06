import React, { useState, useEffect } from 'react'
import {
  STORAGE,
  SEED_USERS,
  SEED_BUSINESSES,
  SEED_SCANS,
  SEED_REVIEWS,
  SEED_PAYMENTS,
} from './seed.js'

// ==========================================================================
// CORE HELPERS & LOCAL STORAGE INITIALIZATION
// ==========================================================================

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE.users) || JSON.parse(localStorage.getItem(STORAGE.users)).length === 0) {
    localStorage.setItem(STORAGE.users, JSON.stringify(SEED_USERS))
  }
  if (!localStorage.getItem(STORAGE.businesses) || JSON.parse(localStorage.getItem(STORAGE.businesses)).length === 0) {
    localStorage.setItem(STORAGE.businesses, JSON.stringify(SEED_BUSINESSES))
  }
  if (!localStorage.getItem(STORAGE.scans) || JSON.parse(localStorage.getItem(STORAGE.scans)).length === 0) {
    localStorage.setItem(STORAGE.scans, JSON.stringify(SEED_SCANS))
  }
  if (!localStorage.getItem(STORAGE.reviews) || JSON.parse(localStorage.getItem(STORAGE.reviews)).length === 0) {
    localStorage.setItem(STORAGE.reviews, JSON.stringify(SEED_REVIEWS))
  }
  if (!localStorage.getItem(STORAGE.payments) || JSON.parse(localStorage.getItem(STORAGE.payments)).length === 0) {
    localStorage.setItem(STORAGE.payments, JSON.stringify(SEED_PAYMENTS))
  }
  if (!localStorage.getItem(STORAGE.currentUser)) {
    localStorage.setItem(STORAGE.currentUser, JSON.stringify(null))
  }
}

// Generate dynamic SVG mock QR code
const renderQRsvg = (shortId) => {
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <rect width="100" height="100" fill="white" />
      <rect x="5" y="5" width="20" height="20" fill="#0f172a" />
      <rect x="8" y="8" width="14" height="14" fill="white" />
      <rect x="11" y="11" width="8" height="8" fill="#2563eb" />
      
      <rect x="75" y="5" width="20" height="20" fill="#0f172a" />
      <rect x="78" y="8" width="14" height="14" fill="white" />
      <rect x="81" y="11" width="8" height="8" fill="#2563eb" />

      <rect x="5" y="75" width="20" height="20" fill="#0f172a" />
      <rect x="8" y="78" width="14" height="14" fill="white" />
      <rect x="11" y="81" width="8" height="8" fill="#2563eb" />

      <rect x="40" y="40" width="20" height="20" rx="4" fill="#0f172a" />
      <circle cx="50" cy="50" r="6" fill="#2563eb" />
      <circle cx="50" cy="50" r="3" fill="white" />

      <path d="M 30,10 H 35 V 15 H 30 Z M 40,5 H 45 V 10 H 40 Z M 50,15 H 55 V 20 H 50 Z M 60,10 H 65 V 15 H 60 Z M 70,5 H 75 V 10 H 70 Z
               M 35,30 H 40 V 35 H 35 Z M 45,25 H 50 V 30 H 45 Z M 55,35 H 60 V 40 H 55 Z M 65,30 H 70 V 35 H 65 Z M 10,35 H 15 V 40 H 10 Z
               M 15,50 H 20 V 55 H 15 Z M 25,45 H 30 V 50 H 25 Z M 5,60 H 10 V 65 H 5 Z M 30,55 H 35 V 60 H 30 Z M 35,65 H 40 V 70 H 35 Z
               M 45,50 H 50 V 55 H 45 Z M 55,45 H 60 V 50 H 55 Z M 65,55 H 70 V 60 H 65 Z M 70,45 H 75 V 50 H 70 Z M 60,65 H 65 V 70 H 60 Z
               M 45,75 H 50 V 80 H 45 Z M 55,80 H 60 V 85 H 55 Z M 65,75 H 70 V 80 H 65 Z M 70,85 H 75 V 90 H 70 Z M 75,75 H 95 V 95 H 75 Z" 
            fill="#0f172a" opacity="0.85" />
    </svg>
  )
}

// Dynamic Natural Review Builder
const generateReviewDraft = (business, rating, selectedTags) => {
  if (rating < 4) return ""
  if (selectedTags.length === 0) {
    return `Excellent service at ${business.name}. The experience was highly satisfying, professional, and met all our expectations!`
  }

  const tagList = [...selectedTags]
  
  // Custom templates based on category to make them sound human
  if (business.category?.toLowerCase() === 'healthcare' || business.category?.toLowerCase() === 'clinic') {
    let intro = `Highly satisfied with the treatment at ${business.name}! `
    let body = ""
    let outro = ` Highly recommended clinic in ${business.location || 'our neighborhood'}.`

    if (tagList.includes('best medical clinic') || tagList.includes('best dental clinic')) {
      const bestTag = tagList.includes('best dental clinic') ? 'best dental clinic' : 'best medical clinic'
      body += `This is undoubtedly the ${bestTag}, providing extremely attentive and detailed care.`
      tagList.splice(tagList.indexOf(bestTag), 1)
    }
    if (tagList.includes('clean clinic')) {
      body += (body ? " " : "") + "They maintain a very clean clinic with hygienic standards."
      tagList.splice(tagList.indexOf('clean clinic'), 1)
    }
    if (tagList.includes('friendly doctors') || tagList.includes('friendly doctor')) {
      const docTag = tagList.includes('friendly doctors') ? 'friendly doctors' : 'friendly doctor'
      body += (body ? " " : "") + `We appreciated the service from the ${docTag} who answered all our queries patiently.`
      tagList.splice(tagList.indexOf(docTag), 1)
    }

    if (tagList.length > 0) {
      body += (body ? " " : "") + `The ${tagList.join(', ')} was absolutely outstanding.`
    }

    return intro + body + outro
  }

  if (business.category?.toLowerCase() === 'restaurant') {
    let intro = `Had a fantastic dining experience at ${business.name}! `
    let body = ""
    let outro = " Will definitely visit again soon with family and friends."

    if (tagList.includes('best restaurant near me') || tagList.includes('tasty food')) {
      body += "This is easily the best restaurant near me, serving incredibly flavorful dishes."
      tagList.splice(tagList.includes('best restaurant near me') ? tagList.indexOf('best restaurant near me') : tagList.indexOf('tasty food'), 1)
    }
    if (tagList.includes('great ambience')) {
      body += (body ? " " : "") + "The place has a great ambience and comfortable seating."
      tagList.splice(tagList.indexOf('great ambience'), 1)
    }
    if (tagList.includes('fast service')) {
      body += (body ? " " : "") + "We loved the fast service and extremely helpful staff."
      tagList.splice(tagList.indexOf('fast service'), 1)
    }

    if (tagList.length > 0) {
      body += (body ? " " : "") + `Excellent ${tagList.join(', ')}.`
    }

    return intro + body + outro
  }

  // Fallback Template
  let intro = `Highly recommend ${business.name} in ${business.location || 'the area'}. `
  let body = ""
  if (tagList.includes('clean rooms') || tagList.includes('good service')) {
    const serviceTag = tagList.includes('clean rooms') ? 'clean rooms' : 'good service'
    body += `Everything was superb, especially the ${serviceTag}.`
    tagList.splice(tagList.indexOf(serviceTag), 1)
  }
  if (tagList.length > 0) {
    body += (body ? " " : "") + `The ${tagList.join(' and ')} details were outstanding.`
  }
  return intro + body + " Worth every rupee spent!"
}

// Landing Page Simulator Preset Data (No Dada Dev References)
const SIM_BUSINESS_PRESETS = {
  healthcare: {
    name: "Apex Wellness Center",
    category: "Healthcare",
    location: "Dwarka, Delhi",
    shortId: "apexwell",
    googleUrl: "https://g.page/r/demo",
    keywords: [
      'best medical clinic', 'clean clinic', 'friendly doctors', 'wellness checkup', 'quick consultation'
    ]
  },
  restaurant: {
    name: "Spice Garden Restaurant",
    category: "Restaurant",
    location: "Sector 29, Gurgaon",
    shortId: "spicegarden",
    googleUrl: "https://g.page/r/demo2",
    keywords: [
      'best restaurant near me', 'tasty food', 'great ambience', 'fast service', 'North Indian cuisine'
    ]
  },
  hotel: {
    name: "Delhi Crown Hotel",
    category: "Hotel",
    location: "Connaught Place, Delhi",
    shortId: "delhicrown",
    googleUrl: "https://g.page/r/demo3",
    keywords: [
      'best hotel in Delhi', 'clean rooms', 'excellent hospitality', 'deluxe rooms', 'central location'
    ]
  }
}

export default function App() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  
  const [view, setView] = useState('landing') // 'landing' | 'dashboard' | 'review-customer'
  const [currentUser, setCurrentUser] = useState(null)
  
  // Local Database States
  const [dbUsers, setDbUsers] = useState([])
  const [dbBusinesses, setDbBusinesses] = useState([])
  const [dbScans, setDbScans] = useState([])
  const [dbReviews, setDbReviews] = useState([])
  const [dbPayments, setDbPayments] = useState([])

  // Selection/Input States
  const [activeBusinessId, setActiveBusinessId] = useState(null) // for customer review flow
  const [dashboardTab, setDashboardTab] = useState('analytics') // tab subview

  // Modals & Signup Flow
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState('login') // 'login' | 'register'
  
  // Login Inputs
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Multi-step Registration Wizard state
  const [regStep, setRegStep] = useState(1) // 1: Account, 2: Business, 3: Plan, 4: Payment, 5: Processing
  
  // Step 1: Account details
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPhone, setRegPhone] = useState('')
  
  // Step 2: Business details
  const [regBizName, setRegBizName] = useState('')
  const [regBizCategory, setRegBizCategory] = useState('healthcare') // 'healthcare' | 'restaurant' | 'hotel' | 'other'
  const [regBizServices, setRegBizServices] = useState('')
  const [regBizReviewUrl, setRegBizReviewUrl] = useState('')
  const [regBizLocation, setRegBizLocation] = useState('')

  // Step 3: Choose Plan
  const [regPlan, setRegPlan] = useState('pro') // 'starter' | 'pro'

  // Step 4: Payment details
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [paymentError, setPaymentError] = useState('')

  // UPI payment configurations
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'upi'
  const [upiSubMethod, setUpiSubMethod] = useState('qr') // 'qr' | 'collect'
  const [buyerUpiId, setBuyerUpiId] = useState('')
  const [upiUtr, setUpiUtr] = useState('')
  const [upiTimer, setUpiTimer] = useState(300)
  const [collectRequestSent, setCollectRequestSent] = useState(false)

  // Simulator State (Landing page)
  const [simCategory, setSimCategory] = useState('healthcare')
  const [simRating, setSimRating] = useState(5)
  const [simSelectedTags, setSimSelectedTags] = useState([])
  const [simCopied, setSimCopied] = useState(false)
  const [simFeedbackText, setSimFeedbackText] = useState("")
  const [simFeedbackSubmitted, setSimFeedbackSubmitted] = useState(false)

  // Customer Portal State
  const [custRating, setCustRating] = useState(0)
  const [custSelectedTags, setCustSelectedTags] = useState([])
  const [custFeedbackText, setCustFeedbackText] = useState("")
  const [custSubmitted, setCustSubmitted] = useState(false)
  const [custFeedbackSubmitted, setCustFeedbackSubmitted] = useState(false)

  // Image Upload and Lightbox States
  const [simUploadedImages, setSimUploadedImages] = useState([])
  const [custUploadedImages, setCustUploadedImages] = useState([])
  const [activeLightboxImage, setActiveLightboxImage] = useState(null)

  // SEO Tip Generator Dropdown (Footer)
  const [footerCategory, setFooterCategory] = useState('dental')
  const [footerTip, setFooterTip] = useState("Ask dental patients to tap 'painless scaling' or 'root canal' tags so searchers looking for pain-free treatment find your clinic first.")

  // Edit / Input States in Dashboard
  const [newKeywordType, setNewKeywordType] = useState('primary') // 'primary' | 'secondary' | 'geo' | 'service'
  const [newKeywordVal, setNewKeywordVal] = useState('')
  const [newServiceVal, setNewServiceVal] = useState('')
  const [reviewsFilter, setReviewsFilter] = useState('all') // 'all' | 'private'

  // QR Flyer Editor configuration
  const [flyerHeader, setFlyerHeader] = useState("Help Us Grow!")
  const [flyerBody, setFlyerBody] = useState("Scan the QR code below to quickly share your feedback. Your review helps other neighbors find us on Google Maps!")
  const [flyerBorderColor, setFlyerBorderColor] = useState("#2563eb")

  // Merchant UPI ID constant for payments redirection
  const MERCHANT_UPI_ID = "9354384835-3@ybl"

  // Load and sync local storage
  useEffect(() => {
    initLocalStorage()
    let users = JSON.parse(localStorage.getItem(STORAGE.users)) || []
    let businesses = JSON.parse(localStorage.getItem(STORAGE.businesses)) || []
    let scans = JSON.parse(localStorage.getItem(STORAGE.scans)) || []
    let reviews = JSON.parse(localStorage.getItem(STORAGE.reviews)) || []
    let payments = JSON.parse(localStorage.getItem(STORAGE.payments)) || []

    let needsSync = false

    // Guarantee that Dev Caterers data is present in localStorage if not already there
    if (!users.some(u => u.id === 'u_dev')) {
      users.push({
        id: 'u_dev',
        name: 'Dev Sharma',
        email: 'dev@caterers.com',
        password: 'dev',
        phone: '+91 93543 84835',
        plan: 'pro',
        registeredAt: Date.now() - 86400000 * 25,
        paymentStatus: 'paid',
        totalPaid: 5999
      })
      needsSync = true
    }

    if (!businesses.some(b => b.id === 'b_dev')) {
      businesses.push({
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
      })
      needsSync = true
    }

    if (!scans.some(s => s.businessId === 'b_dev')) {
      const now = Date.now()
      const seedScans = Array.from({ length: 114 }, (_, i) => ({
        id: `sc_dev_${i}`,
        businessId: 'b_dev',
        time: now - Math.random() * 86400000 * 25,
        converted: Math.random() > 0.45
      }))
      scans = [...scans, ...seedScans]
      needsSync = true
    }

    if (!reviews.some(r => r.businessId === 'b_dev')) {
      const now = Date.now()
      const seedReviews = [
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
      reviews = [...reviews, ...seedReviews]
      needsSync = true
    }

    if (!payments.some(p => p.userId === 'u_dev')) {
      payments.push({
        id: 'inv_dev_1',
        userId: 'u_dev',
        amount: 5999,
        plan: 'pro',
        date: Date.now() - 86400000 * 25,
        status: 'success'
      })
      needsSync = true
    }

    if (needsSync) {
      localStorage.setItem(STORAGE.users, JSON.stringify(users))
      localStorage.setItem(STORAGE.businesses, JSON.stringify(businesses))
      localStorage.setItem(STORAGE.scans, JSON.stringify(scans))
      localStorage.setItem(STORAGE.reviews, JSON.stringify(reviews))
      localStorage.setItem(STORAGE.payments, JSON.stringify(payments))
    }

    setDbUsers(users)
    setDbBusinesses(businesses)
    setDbScans(scans)
    setDbReviews(reviews)
    setDbPayments(payments)
    
    const user = JSON.parse(localStorage.getItem(STORAGE.currentUser))
    if (user) {
      setCurrentUser(user)
    }

    // Parse URL query parameters for QR scan redirect
    const params = new URLSearchParams(window.location.search)
    const refBizShortId = params.get('r')
    if (refBizShortId) {
      const matchedBiz = businesses.find(b => b.shortId === refBizShortId)
      if (matchedBiz) {
        // 1. Record a new scan with converted: false
        const newScan = {
          id: `sc_qr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          businessId: matchedBiz.id,
          time: Date.now(),
          converted: false
        }
        const updatedScans = [newScan, ...scans]
        localStorage.setItem(STORAGE.scans, JSON.stringify(updatedScans))
        setDbScans(updatedScans)

        // 2. Route customer directly to review view
        setActiveBusinessId(refBizShortId)
        setCustRating(0)
        setCustSelectedTags([])
        setCustFeedbackText("")
        setCustSubmitted(false)
        setCustFeedbackSubmitted(false)
        setView('review-customer')
        
        // 3. Clear query parameters from URL to avoid repeating on refresh
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // UPI Countdown Timer hook for simulated collect requests
  useEffect(() => {
    let interval = null
    if (collectRequestSent && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer(prev => prev - 1)
      }, 1000)
    } else if (upiTimer === 0 && collectRequestSent) {
      setCollectRequestSent(false)
      alert('Collect request timed out. Please try sending it again.')
    }
    return () => clearInterval(interval)
  }, [collectRequestSent, upiTimer])

  // Sync back to local storage helper
  const syncState = (key, data, setter) => {
    localStorage.setItem(key, JSON.stringify(data))
    setter(data)
  }

  // ==========================================================================
  // INPUT FORMATTERS
  // ==========================================================================

  // Formats card numbers with spaces every 4 digits: 0000 0000 0000 0000
  const handleCardNumberChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 16)
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean
    setCardNumber(formatted)
  }

  // Formats expiry dates: MM/YY
  const handleCardExpiryChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    if (clean.length >= 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`)
    } else {
      setCardExpiry(clean)
    }
  }

  // Format CVV to max 3 digits
  const handleCardCvvChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 3)
    setCardCvv(clean)
  }

  // ==========================================================================
  // ACTION HANDLERS
  // ==========================================================================

  // Authentication: Standard Login
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setLoginError('')
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password.')
      return
    }

    const matchedUser = dbUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.password === loginPassword)
    if (matchedUser) {
      localStorage.setItem(STORAGE.currentUser, JSON.stringify(matchedUser))
      setCurrentUser(matchedUser)
      setShowAuthModal(false)
      setLoginEmail('')
      setLoginPassword('')
      setView('dashboard')
      setDashboardTab('analytics')
    } else {
      setLoginError('Invalid email credentials or account unpaid. Please register to create a new profile.')
    }
  }

  // Registration Multi-Step Validation & Next buttons
  const handleRegNextStep = () => {
    if (regStep === 1) {
      // Validate Account credentials
      if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim()) {
        alert('All credentials are required to setup your account.')
        return
      }
      if (dbUsers.some(u => u.email.toLowerCase() === regEmail.toLowerCase().trim())) {
        alert('This email address is already registered.')
        return
      }
      setRegStep(2)
    } else if (regStep === 2) {
      // Validate Business Profile
      if (!regBizName.trim() || !regBizLocation.trim() || !regBizReviewUrl.trim()) {
        alert('Please fill out business name, location, and target review URL.')
        return
      }
      setRegStep(3)
    } else if (regStep === 3) {
      // Advance to Payment Form
      setRegStep(4)
    }
  }

  // Core helper to handle successful payments and write account credentials
  const completeSuccessfulCheckout = (amount, method, refId) => {
    const nowTime = Date.now()
    const userId = `usr_${nowTime}`
    const bizId = `biz_${nowTime}`
    const shortId = regBizName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) + Math.floor(Math.random() * 100)

    // 1. Create and Save New User Account
    const newUser = {
      id: userId,
      name: regName,
      email: regEmail.toLowerCase().trim(),
      password: regPassword,
      phone: regPhone,
      plan: regPlan,
      registeredAt: nowTime,
      paymentStatus: 'paid',
      totalPaid: amount
    }
    const updatedUsers = [...dbUsers, newUser]
    syncState(STORAGE.users, updatedUsers, setDbUsers)

    // 2. Generate keywords based on categories (advanced, high-end SEO terms)
    let keywordsObj = {
      primary_keywords: ['highest quality service', 'trusted industry professionals', 'affordable premium solutions', 'highly recommended expertise'],
      secondary_keywords: ['outstanding customer relations', 'prompt professional support', 'exceptional overall experience', 'top rated service provider'],
      geo_keywords: [regBizLocation.split(',')[0].trim()],
      service_keywords: regBizServices.split(',').map(s => s.trim()).filter(Boolean)
    }

    if (regBizCategory === 'healthcare') {
      keywordsObj.primary_keywords = ['best medical clinic', 'painless treatment', 'expert specialist doctors', 'top dental healthcare']
      keywordsObj.secondary_keywords = ['hygienic care clinic', 'highly recommended therapist', 'modern medical equipment', 'compassionate patient care']
    } else if (regBizCategory === 'restaurant') {
      keywordsObj.primary_keywords = ['best dining experience', 'authentic gourmet cuisine', 'top rated restaurant near me', 'hygienic preparation']
      keywordsObj.secondary_keywords = ['luxurious ambience', 'impeccable table service', 'delicious signature dishes', 'highly skilled culinary team']
    } else if (regBizCategory === 'hotel') {
      keywordsObj.primary_keywords = ['premium luxury stay', 'clean sanitized rooms', 'top rated central accommodation', 'impeccable room service']
      keywordsObj.secondary_keywords = ['excellent hospitality standards', 'convenient central location', 'modern business hotel suites', 'highly recommended guest experience']
    }

    // 3. Create and Save Business Profile
    const newBiz = {
      id: bizId,
      userId: userId,
      name: regBizName,
      category: regBizCategory,
      services: regBizServices.split(',').map(s => s.trim()).filter(Boolean),
      location: regBizLocation,
      shortId: shortId,
      googleUrl: regBizReviewUrl,
      keywords: keywordsObj
    }
    const updatedBusinesses = [...dbBusinesses, newBiz]
    syncState(STORAGE.businesses, updatedBusinesses, setDbBusinesses)

    // 4. Create and Save Invoice Payment Record
    const newPayRecord = {
      id: refId || `inv_${nowTime}`,
      userId: userId,
      amount: amount,
      plan: regPlan,
      date: nowTime,
      status: 'success'
    }
    const updatedPayments = [...dbPayments, newPayRecord]
    syncState(STORAGE.payments, updatedPayments, setDbPayments)

    // 5. Automatically log in user and set view
    localStorage.setItem(STORAGE.currentUser, JSON.stringify(newUser))
    setCurrentUser(newUser)

    // Reset signup fields
    setRegStep(1)
    setRegName('')
    setRegEmail('')
    setRegPassword('')
    setRegPhone('')
    setRegBizName('')
    setRegBizServices('')
    setRegBizReviewUrl('')
    setRegBizLocation('')
    setCardHolder('')
    setCardNumber('')
    setCardExpiry('')
    setCardCvv('')
    setBuyerUpiId('')
    setUpiUtr('')
    setCollectRequestSent(false)
    
    setShowAuthModal(false)
    setView('dashboard')
    setDashboardTab('analytics')
  }

  // Execute Credit Card checkout
  const executePaymentRegistration = () => {
    setPaymentError('')
    if (!cardHolder.trim() || cardNumber.replace(/\s/g, '').length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
      setPaymentError('Please fill in valid card parameters.')
      return
    }

    setRegStep(5)
    setTimeout(() => {
      const amount = regPlan === 'starter' ? 3999 : 5999
      completeSuccessfulCheckout(amount, 'credit_card', `cc_${Date.now()}`)
    }, 2500)
  }

  // UPI Option A: QR code UTR validation
  const executeUpiQrRegistration = () => {
    setPaymentError('')
    if (upiUtr.trim().length < 8) {
      setPaymentError('Please enter a valid UPI UTR/Transaction Reference number (min 8 digits).')
      return
    }
    setRegStep(5)
    setTimeout(() => {
      const amount = regPlan === 'starter' ? 3999 : 5999
      completeSuccessfulCheckout(amount, 'upi_qr', `utr_${upiUtr}`)
    }, 2500)
  }

  // UPI Option B: Collect Request trigger
  const sendUpiCollectRequest = () => {
    setPaymentError('')
    if (!buyerUpiId.trim() || !buyerUpiId.includes('@')) {
      setPaymentError('Please enter a valid UPI ID (e.g. name@bank).')
      return
    }
    setUpiTimer(300)
    setCollectRequestSent(true)
  }

  // UPI Option B: Confirm approval simulation
  const executeUpiCollectRegistration = () => {
    setRegStep(5)
    setTimeout(() => {
      const amount = regPlan === 'starter' ? 3999 : 5999
      completeSuccessfulCheckout(amount, 'upi_collect', `upi_req_${Date.now()}`)
    }, 2500)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE.currentUser)
    setCurrentUser(null)
    setView('landing')
  }

  // Handle image upload input
  const handleImageChange = (e, isSimulator = false) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isSimulator) {
          setSimUploadedImages(prev => [...prev, reader.result])
        } else {
          setCustUploadedImages(prev => [...prev, reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove uploaded image
  const removeUploadedImage = (idx, isSimulator = false) => {
    if (isSimulator) {
      setSimUploadedImages(prev => prev.filter((_, i) => i !== idx))
    } else {
      setCustUploadedImages(prev => prev.filter((_, i) => i !== idx))
    }
  }

  // Submit Feedback Recovery (Gating)
  const submitFeedback = (business, stars, feedbackText, isSimulator = false, images = []) => {
    if (!feedbackText.trim()) return

    const newFeedback = {
      id: `rv_feed_${Date.now()}`,
      businessId: business.id,
      text: `[PRIVATE FEEDBACK] ${feedbackText}`,
      rating: stars,
      time: Date.now(),
      images: images // Save image attachments privately
    }

    const updatedReviews = [newFeedback, ...dbReviews]
    syncState(STORAGE.reviews, updatedReviews, setDbReviews)

    // Mark scan as converted if not simulator
    if (!isSimulator) {
      const scans = [...dbScans]
      const lastScanIdx = scans.findIndex(s => s.businessId === business.id && !s.converted)
      if (lastScanIdx !== -1) {
        scans[lastScanIdx].converted = true
        syncState(STORAGE.scans, scans, setDbScans)
      } else {
        const newScan = {
          id: `sc_new_${Date.now()}`,
          businessId: business.id,
          time: Date.now(),
          converted: true
        }
        const updatedScans = [newScan, ...dbScans]
        syncState(STORAGE.scans, updatedScans, setDbScans)
      }
    }

    if (isSimulator) {
      setSimFeedbackSubmitted(true)
      setSimUploadedImages([])
    } else {
      setCustFeedbackSubmitted(true)
      setCustUploadedImages([])
    }
  }

  // Converted scan tracker (Google click)
  const trackGoogleRedirect = (business, stars, reviewText, images = []) => {
    // Mark scan as converted
    const scans = [...dbScans]
    const lastScanIdx = scans.findIndex(s => s.businessId === business.id && !s.converted)
    if (lastScanIdx !== -1) {
      scans[lastScanIdx].converted = true
      syncState(STORAGE.scans, scans, setDbScans)
    } else {
      const newScan = {
        id: `sc_new_${Date.now()}`,
        businessId: business.id,
        time: Date.now(),
        converted: true
      }
      const updatedScans = [newScan, ...dbScans]
      syncState(STORAGE.scans, updatedScans, setDbScans)
    }

    const newReviewObj = {
      id: `rv_pub_${Date.now()}`,
      businessId: business.id,
      text: reviewText,
      rating: stars,
      time: Date.now(),
      images: images // Save user-uploaded photos
    }
    const updatedReviews = [newReviewObj, ...dbReviews]
    syncState(STORAGE.reviews, updatedReviews, setDbReviews)
  }

  // Keywords management (Dashboard)
  const addKeyword = (businessId, type, val) => {
    if (!val.trim()) return
    const updatedBusinesses = dbBusinesses.map(b => {
      if (b.id === businessId) {
        const keywords = { ...b.keywords }
        const key = `${type}_keywords`
        if (!keywords[key]) keywords[key] = []
        if (!keywords[key].includes(val.trim())) {
          keywords[key].push(val.trim())
        }
        return { ...b, keywords }
      }
      return b
    })
    syncState(STORAGE.businesses, updatedBusinesses, setDbBusinesses)
    setNewKeywordVal('')
  }

  const removeKeyword = (businessId, type, index) => {
    const updatedBusinesses = dbBusinesses.map(b => {
      if (b.id === businessId) {
        const keywords = { ...b.keywords }
        const key = `${type}_keywords`
        keywords[key].splice(index, 1)
        return { ...b, keywords }
      }
      return b
    })
    syncState(STORAGE.businesses, updatedBusinesses, setDbBusinesses)
  }

  const addService = (businessId, service) => {
    if (!service.trim()) return
    const updatedBusinesses = dbBusinesses.map(b => {
      if (b.id === businessId) {
        const services = [...b.services]
        if (!services.includes(service.trim())) {
          services.push(service.trim())
        }
        return { ...b, services }
      }
      return b
    })
    syncState(STORAGE.businesses, updatedBusinesses, setDbBusinesses)
    setNewServiceVal('')
  }

  const removeService = (businessId, index) => {
    const updatedBusinesses = dbBusinesses.map(b => {
      if (b.id === businessId) {
        const services = [...b.services]
        services.splice(index, 1)
        return { ...b, services }
      }
      return b
    })
    syncState(STORAGE.businesses, updatedBusinesses, setDbBusinesses)
  }

  const updateBusinessGoogleUrl = (businessId, url) => {
    const updatedBusinesses = dbBusinesses.map(b => {
      if (b.id === businessId) {
        return { ...b, googleUrl: url }
      }
      return b
    })
    syncState(STORAGE.businesses, updatedBusinesses, setDbBusinesses)
  }

  // Footer Tip Generator Handler
  const handleFooterTipChange = (cat) => {
    setFooterCategory(cat)
    if (cat === 'dental') {
      setFooterTip("Ask dental patients to tap 'painless scaling' or 'root canal' tags so searchers looking for pain-free treatment find your clinic first.")
    } else if (cat === 'gym') {
      setFooterTip("Gyms should seed keywords like 'best functional training' or 'personal trainer'. Google maps algorithm uses reviews to match local fitness searches.")
    } else if (cat === 'bakery') {
      setFooterTip("Bakeries benefit from specific pastry products tags like 'fresh sourdough' and 'eggless cakes' to appear in local search packs.")
    } else if (cat === 'salon') {
      setFooterTip("Salons should promote service tags like 'hair balayage' and 'hydra facial' to increase maps listing relevance.")
    }
  }

  // ==========================================================================
  // VIEW RENDER VARIABLES & COMPILATIONS
  // ==========================================================================

  // Active business context for logged in user
  const activeBusiness = currentUser ? dbBusinesses.find(b => b.userId === currentUser.id) : null

  // Analytics helper calculations
  const scansForActive = activeBusiness ? dbScans.filter(s => s.businessId === activeBusiness.id) : []
  const reviewsForActive = activeBusiness ? dbReviews.filter(r => r.businessId === activeBusiness.id) : []
  
  const publicReviews = reviewsForActive.filter(r => !r.text.startsWith('[PRIVATE FEEDBACK]'))
  const privateReviews = reviewsForActive.filter(r => r.text.startsWith('[PRIVATE FEEDBACK]'))

  const totalScans = scansForActive.length
  const totalReviews = publicReviews.length
  const conversionRate = totalScans > 0 ? ((scansForActive.filter(s => s.converted).length / totalScans) * 100).toFixed(1) : 0
  const avgRating = publicReviews.length > 0 ? (publicReviews.reduce((sum, r) => sum + r.rating, 0) / publicReviews.length).toFixed(1) : "0.0"

  // Dynamic billing date renewal helper: 30 days from the latest successful payment
  const nextBillingDate = (() => {
    if (!currentUser) return ""
    const userPayments = dbPayments.filter(p => p.userId === currentUser.id && p.status === 'success')
    if (userPayments.length === 0) {
      return new Date(currentUser.registeredAt + 86400000 * 30).toLocaleDateString()
    }
    const sorted = [...userPayments].sort((a, b) => b.date - a.date)
    return new Date(sorted[0].date + 86400000 * 30).toLocaleDateString()
  })()

  // Get grouped daily scans for the last 30 days
  const chartData = (() => {
    if (!activeBusiness) return []
    const points = []
    const nowTime = Date.now()
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(nowTime - i * 86400000)
      dayStart.setHours(0, 0, 0, 0)
      const dayStartTime = dayStart.getTime()
      
      const dayEnd = new Date(nowTime - i * 86400000)
      dayEnd.setHours(23, 59, 59, 999)
      const dayEndTime = dayEnd.getTime()
      
      const count = scansForActive.filter(s => s.time >= dayStartTime && s.time <= dayEndTime).length
      points.push({
        label: dayStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count
      })
    }
    return points
  })()

  // Build SVG path description for chartData
  const svgChartPath = (() => {
    if (chartData.length === 0) return { line: "", area: "", coords: [] }
    const maxVal = Math.max(...chartData.map(p => p.count), 5)
    
    // Draw SVG coordinates in 500x150 viewport (X: 15-485, Y: 20-120)
    const coords = chartData.map((pt, i) => {
      const x = 15 + i * (470 / 29)
      const y = 120 - (pt.count * (100 / maxVal))
      return { x, y }
    })
    
    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
    const areaPath = `${linePath} L 485 120 L 15 120 Z`
    return { line: linePath, area: areaPath, coords }
  })()

  // Keyword highlighting scanner inside reviews
  const renderHighlightedReviewText = (text, keywordsObj) => {
    if (!keywordsObj) return text
    const allKeywords = [
      ...(keywordsObj.primary_keywords || []),
      ...(keywordsObj.secondary_keywords || []),
      ...(keywordsObj.geo_keywords || []),
      ...(keywordsObj.service_keywords || []),
    ].filter(Boolean)

    if (allKeywords.length === 0) return text
    allKeywords.sort((a, b) => b.length - a.length)

    const escaped = allKeywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi')

    const parts = text.split(regex)
    if (parts.length === 1) return text

    return parts.map((part, index) => {
      const match = allKeywords.find(k => k.toLowerCase() === part.toLowerCase())
      if (match) {
        return <span key={index} className="highlighted-seo-keyword">{part}</span>
      }
      return part
    })
  }

  // Active preset business details for the landing simulator
  const activeSimPreset = SIM_BUSINESS_PRESETS[simCategory]
  const simReviewText = generateReviewDraft(
    { name: activeSimPreset.name, category: activeSimPreset.category },
    simRating,
    simSelectedTags
  )

  // ==========================================================================
  // RENDER SECTIONS
  // ==========================================================================

  return (
    <div>
      
      {/* AUTHENTICATION & REGISTRATION MODAL CONTAINER */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => { if (regStep !== 5) setShowAuthModal(false) }}>
          <div className="modal-content glass card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: authTab === 'register' ? '550px' : '450px' }}>
            
            {/* Modal Navigation Tab (Hidden during registration wizard steps > 1) */}
            {regStep === 1 && (
              <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
                <button 
                  className={`btn ${authTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => { setAuthTab('login'); setLoginError('') }}
                >
                  Sign In
                </button>
                <button 
                  className={`btn ${authTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => setAuthTab('register')}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* LOGIN SUBVIEW */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Access Dashboard</h3>
                {loginError && (
                  <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px' }}>
                    {loginError}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    placeholder="name@business.com" 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Sign In to Dashboard
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '10px', borderColor: 'var(--color-success)', color: 'var(--color-success)', background: 'var(--color-success-bg)' }}
                  onClick={() => {
                    // Force seed data for Dev Caterers to guarantee it is always present
                    const cleanUsers = [...dbUsers]
                    if (!cleanUsers.some(u => u.id === 'u_dev')) {
                      cleanUsers.push({
                        id: 'u_dev',
                        name: 'Dev Sharma',
                        email: 'dev@caterers.com',
                        password: 'dev',
                        phone: '+91 93543 84835',
                        plan: 'pro',
                        registeredAt: Date.now() - 86400000 * 25,
                        paymentStatus: 'paid',
                        totalPaid: 5999
                      })
                      syncState(STORAGE.users, cleanUsers, setDbUsers)
                    }

                    const cleanBiz = [...dbBusinesses]
                    if (!cleanBiz.some(b => b.id === 'b_dev')) {
                      cleanBiz.push({
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
                      })
                      syncState(STORAGE.businesses, cleanBiz, setDbBusinesses)
                    }

                    const cleanScans = [...dbScans]
                    if (!cleanScans.some(s => s.id.startsWith('sc_dev_'))) {
                      const now = Date.now()
                      const seedScans = Array.from({ length: 114 }, (_, i) => ({
                        id: `sc_dev_${i}`,
                        businessId: 'b_dev',
                        time: now - Math.random() * 86400000 * 25,
                        converted: Math.random() > 0.45
                      }))
                      const updated = [...cleanScans, ...seedScans]
                      syncState(STORAGE.scans, updated, setDbScans)
                    }

                    const cleanReviews = [...dbReviews]
                    if (!cleanReviews.some(r => r.id.startsWith('rv_dev_'))) {
                      const now = Date.now()
                      const seedReviews = [
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
                      const updated = [...cleanReviews, ...seedReviews]
                      syncState(STORAGE.reviews, updated, setDbReviews)
                    }

                    const cleanPayments = [...dbPayments]
                    if (!cleanPayments.some(p => p.id === 'inv_dev_1')) {
                      cleanPayments.push({
                        id: 'inv_dev_1',
                        userId: 'u_dev',
                        amount: 5999,
                        plan: 'pro',
                        date: Date.now() - 86400000 * 25,
                        status: 'success'
                      })
                      syncState(STORAGE.payments, cleanPayments, setDbPayments)
                    }

                    const matchedUser = cleanUsers.find(u => u.id === 'u_dev') || {
                      id: 'u_dev',
                      name: 'Dev Sharma',
                      email: 'dev@caterers.com',
                      password: 'dev',
                      phone: '+91 93543 84835',
                      plan: 'pro',
                      registeredAt: Date.now() - 86400000 * 25,
                      paymentStatus: 'paid',
                      totalPaid: 5999
                    }

                    localStorage.setItem(STORAGE.currentUser, JSON.stringify(matchedUser))
                    setCurrentUser(matchedUser)
                    setShowAuthModal(false)
                    setLoginEmail('')
                    setLoginPassword('')
                    setView('dashboard')
                    setDashboardTab('analytics')
                  }}
                >
                  ⚡ Quick Login: Dev Caterers (Demo)
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ width: '100%', marginTop: '10px' }} 
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            {/* REGISTRATION WIZARD SUBVIEW */}
            {authTab === 'register' && (
              <div>
                
                {/* Step Track display */}
                {regStep <= 4 && (
                  <div className="wizard-steps">
                    <div className={`wizard-step ${regStep >= 1 ? 'completed' : ''}`}>1</div>
                    <div className={`wizard-step ${regStep === 2 ? 'active' : regStep > 2 ? 'completed' : ''}`}>2</div>
                    <div className={`wizard-step ${regStep === 3 ? 'active' : regStep > 3 ? 'completed' : ''}`}>3</div>
                    <div className={`wizard-step ${regStep === 4 ? 'active' : ''}`}>4</div>
                  </div>
                )}

                {/* Step 1: Account details */}
                {regStep === 1 && (
                  <div>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Step 1: Create Owner Profile</h3>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={regName} 
                        onChange={(e) => setRegName(e.target.value)} 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control"
                        value={regEmail} 
                        onChange={(e) => setRegEmail(e.target.value)} 
                        placeholder="john@dentalcare.com" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input 
                        type="password" 
                        className="form-control"
                        value={regPassword} 
                        onChange={(e) => setRegPassword(e.target.value)} 
                        placeholder="Choose a strong password" 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control"
                        value={regPhone} 
                        onChange={(e) => setRegPhone(e.target.value)} 
                        placeholder="+91 98765 43210" 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRegNextStep}>
                        Next: Business Profile →
                      </button>
                      <button className="btn btn-secondary" onClick={() => setShowAuthModal(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Step 2: Business Profile */}
                {regStep === 2 && (
                  <div>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Step 2: Business Information</h3>
                    <div className="form-group">
                      <label className="form-label">Business Name</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={regBizName} 
                        onChange={(e) => setRegBizName(e.target.value)} 
                        placeholder="e.g. Apex Dental Center" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-control"
                        value={regBizCategory} 
                        onChange={(e) => setRegBizCategory(e.target.value)}
                      >
                        <option value="healthcare">🏥 Healthcare Clinic</option>
                        <option value="restaurant">🍔 Restaurant / Cafe</option>
                        <option value="hotel">🏨 Hotel / Stay</option>
                        <option value="other">🛍️ Retail / Other Services</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location (City, Area)</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={regBizLocation} 
                        onChange={(e) => setRegBizLocation(e.target.value)} 
                        placeholder="e.g. Dwarka, Delhi" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Key Services offered (Comma separated)</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={regBizServices} 
                        onChange={(e) => setRegBizServices(e.target.value)} 
                        placeholder="e.g. Root Canal, Teeth Whitening, Implants" 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Target Google Review URL</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={regBizReviewUrl} 
                        onChange={(e) => setRegBizReviewUrl(e.target.value)} 
                        placeholder="e.g. https://g.page/r/your-id/review" 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRegNextStep}>
                        Next: Select Plan →
                      </button>
                      <button className="btn btn-secondary" onClick={() => setRegStep(1)}>← Back</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Choose Plan */}
                {regStep === 3 && (
                  <div>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Step 3: Select Your Growth Package</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      
                      <div 
                        className={`card ${regPlan === 'starter' ? 'popular' : ''}`}
                        style={{ padding: '16px', cursor: 'pointer', textAlign: 'left', border: regPlan === 'starter' ? '2.5px solid var(--color-brand)' : '1px solid var(--border-color)' }}
                        onClick={() => setRegPlan('starter')}
                      >
                        <strong style={{ fontSize: '16px', display: 'block' }}>Basic Growth Plan</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          ₹3,999 / month • 1 Location • 200 scans limit • Standard support
                        </span>
                      </div>

                      <div 
                        className={`card ${regPlan === 'pro' ? 'popular' : ''}`}
                        style={{ padding: '16px', cursor: 'pointer', textAlign: 'left', border: regPlan === 'pro' ? '2.5px solid var(--color-brand)' : '1px solid var(--border-color)' }}
                        onClick={() => setRegPlan('pro')}
                      >
                        <strong style={{ fontSize: '16px', display: 'block', color: 'var(--color-brand)' }}>Pro Optimization Plan</strong>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          ₹5,999 / month • 3 Locations • Unlimited scans • Custom QR Editor & SVG History graphs
                        </span>
                      </div>

                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRegNextStep}>
                        Next: Proceed to Payment →
                      </button>
                      <button className="btn btn-secondary" onClick={() => setRegStep(2)}>← Back</button>
                    </div>
                  </div>
                )}

                {/* Step 4: Integrated Payment Gateway (Credit Card & UPI) */}
                {regStep === 4 && (
                  <div>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Step 4: Secure Checkout Portal</h3>
                    
                    {paymentError && (
                      <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: '14px' }}>
                        {paymentError}
                      </div>
                    )}

                    {/* Method Selector Tabs */}
                    <div className="payment-tabs">
                      <button 
                        className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => { setPaymentMethod('card'); setPaymentError('') }}
                      >
                        💳 Credit Card
                      </button>
                      <button 
                        className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => { setPaymentMethod('upi'); setPaymentError('') }}
                      >
                        📱 UPI Pay
                      </button>
                    </div>

                    {/* CREDIT CARD GATEWAY SUB-PANEL */}
                    {paymentMethod === 'card' && (
                      <div>
                        {/* Interactive credit card visual */}
                        <div className="card-visualizer">
                          <div className="card-visualizer-header">
                            <div className="card-chip"></div>
                            <div className="card-logo">VISA</div>
                          </div>
                          
                          <div className="card-number-display">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>

                          <div className="card-visualizer-footer">
                            <div>
                              <span className="card-info-label">Card Holder</span>
                              <div className="card-info-value">{cardHolder || 'NAME SURNAME'}</div>
                            </div>
                            <div>
                              <span className="card-info-label">Expires</span>
                              <div className="card-info-value">{cardExpiry || 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Card inputs */}
                        <div className="form-group">
                          <label className="form-label">Cardholder Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={cardHolder} 
                            onChange={(e) => setCardHolder(e.target.value)} 
                            placeholder="John Doe" 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Credit Card Number</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={cardNumber} 
                            onChange={(e) => handleCardNumberChange(e.target.value)} 
                            placeholder="4111 2222 3333 4444" 
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Expiration (MM/YY)</label>
                            <input 
                              type="text" 
                              className="form-control"
                              value={cardExpiry} 
                              onChange={(e) => handleCardExpiryChange(e.target.value)} 
                              placeholder="12/28" 
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Secure CVV</label>
                            <input 
                              type="password" 
                              className="form-control"
                              value={cardCvv} 
                              onChange={(e) => handleCardCvvChange(e.target.value)} 
                              placeholder="•••" 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ flex: 1 }} 
                            onClick={executePaymentRegistration}
                          >
                            Pay ₹{regPlan === 'starter' ? '3,999' : '5,999'} & Activate Account
                          </button>
                          <button className="btn btn-secondary" onClick={() => setRegStep(3)}>← Back</button>
                        </div>
                      </div>
                    )}

                    {/* UPI GATEWAY SUB-PANEL */}
                    {paymentMethod === 'upi' && (
                      <div>
                        {/* Sub-selector tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          <button 
                            className={`btn ${upiSubMethod === 'qr' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                            onClick={() => { setUpiSubMethod('qr'); setPaymentError(''); setCollectRequestSent(false) }}
                          >
                            Scan QR Code
                          </button>
                          <button 
                            className={`btn ${upiSubMethod === 'collect' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                            onClick={() => { setUpiSubMethod('collect'); setPaymentError('') }}
                          >
                            Pay via UPI App ID
                          </button>
                        </div>

                        {/* SUB-METHOD 1: QR CODE */}
                        {upiSubMethod === 'qr' && (
                          <div className="upi-panel">
                            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block' }}>Scan to Pay directly using GPay / PhonePe / Paytm</span>
                            
                            <div className="upi-qr-wrapper">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                                  `upi://pay?pa=${MERCHANT_UPI_ID}&pn=ReviewAI&am=${regPlan === 'starter' ? '3999' : '5999'}&cu=INR&tn=ReviewAI%20Subscription`
                                )}`}
                                alt="UPI Payment QR Code" 
                                className="upi-qr-image"
                              />
                            </div>
                            <div className="upi-merchant-details">
                              <strong>Payee UPI ID:</strong> {MERCHANT_UPI_ID}<br/>
                              <strong>Amount:</strong> ₹{regPlan === 'starter' ? '3,999' : '5,999'}
                            </div>

                            <div className="form-group" style={{ marginTop: '20px', textAlign: 'left' }}>
                              <label className="form-label">Enter UPI Transaction Reference UTR</label>
                              <input 
                                type="text" 
                                className="form-control"
                                value={upiUtr}
                                onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ''))}
                                placeholder="12-digit transaction UTR number"
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                              <button 
                                className="btn btn-primary" 
                                style={{ flex: 1 }} 
                                onClick={executeUpiQrRegistration}
                              >
                                Submit UTR & Verify Payment
                              </button>
                              <button className="btn btn-secondary" onClick={() => setRegStep(3)}>← Back</button>
                            </div>
                          </div>
                        )}

                        {/* SUB-METHOD 2: COLLECT REQUEST */}
                        {upiSubMethod === 'collect' && (
                          <div className="upi-panel" style={{ textAlign: 'left' }}>
                            {!collectRequestSent ? (
                              <div>
                                <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Enter your UPI ID to receive a payment request:</h4>
                                <div className="form-group">
                                  <label className="form-label">UPI ID / VPA</label>
                                  <input 
                                    type="text" 
                                    className="form-control"
                                    value={buyerUpiId}
                                    onChange={(e) => setBuyerUpiId(e.target.value)}
                                    placeholder="e.g. name@okhdfcbank"
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                  <button 
                                    className="btn btn-primary" 
                                    style={{ flex: 1 }} 
                                    onClick={sendUpiCollectRequest}
                                  >
                                    Send Payment Collect Request
                                  </button>
                                  <button className="btn btn-secondary" onClick={() => setRegStep(3)}>← Back</button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="upi-collect-alert">
                                  <strong>Request Sent!</strong> We have sent a collection request of ₹{regPlan === 'starter' ? '3,999' : '5,999'} to <strong>{buyerUpiId}</strong>.
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                  Please open your GPay / PhonePe / Paytm app and approve the pending collect request.
                                </p>
                                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Time remaining to approve:</span>
                                  <div className="upi-timer">
                                    {Math.floor(upiTimer / 60)}:{(upiTimer % 60) < 10 ? '0' : ''}{upiTimer % 60}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                  <button 
                                    className="btn btn-primary" 
                                    style={{ flex: 1 }} 
                                    onClick={executeUpiCollectRegistration}
                                  >
                                    Confirm Approval (Verify Payment)
                                  </button>
                                  <button 
                                    className="btn btn-secondary" 
                                    onClick={() => setCollectRequestSent(false)}
                                  >
                                    Change UPI ID
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Gateway Loading Animation */}
                {regStep === 5 && (
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                    <strong style={{ fontSize: '15px' }}>Processing Payment...</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Connecting to bank gateway. Please do not close or reload the page.
                    </span>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ==========================================================================
         LANDING PAGE VIEW
         ========================================================================== */}
      {view === 'landing' && (
        <div>
          {/* Header Navbar */}
          <nav className="navbar glass">
            <div className="container navbar-inner">
              <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setView('landing')}>
                <div className="logo-icon">R</div>
                <span>ReviewAI</span>
              </div>
              <ul className="nav-links">
                <li><a href="#how-it-works" className="nav-link">How it Works</a></li>
                <li><a href="#simulator" className="nav-link">Live Simulator</a></li>
                <li><a href="#pricing" className="nav-link">Pricing</a></li>
                <li><a href="#about" className="nav-link">Our Vision</a></li>
              </ul>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {currentUser ? (
                  <>
                    <button className="btn btn-outline" onClick={() => setView('dashboard')}>
                      Dashboard
                    </button>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                      Log Out
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => { setShowAuthModal(true); setAuthTab('login') }}>
                    Login
                  </button>
                )}
              </div>
            </div>
          </nav>

          {/* Hero Banner Section */}
          <header className="container hero">
            <div>
              <div className="hero-badge">
                <span>✨ Boost Local Google Maps Rankings</span>
              </div>
              <h1 className="hero-title">
                Get Google Reviews That <span className="gradient-text">Actually Rank</span> Your Business
              </h1>
              <p className="hero-subtitle">
                Most reviews say generic things like "good service". Google's algorithm needs local keywords to rank you. ReviewAI guides customers to write high-impact, keyword-rich reviews in 10 seconds.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={() => { setShowAuthModal(true); setAuthTab('register'); setRegStep(1) }}>
                  Start Free Trial
                </button>
                <a href="#simulator" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  Try Simulator
                </a>
              </div>
            </div>
            <div className="hero-media">
              <div className="hero-image-wrapper">
                <img src="/hero_owner.png" alt="Happy local business owner showing a Google 5-star review page" />
              </div>
            </div>
          </header>

          {/* Interactive Simulator Section */}
          <section id="simulator" className="simulator-section">
            <div className="container">
              <div className="section-header">
                <h2>Interactive Live Demo</h2>
                <p>Experience how our review helper guides customers to write high-ranking reviews. Select a business type and tap keyword highlights below.</p>
              </div>
              
              <div className="simulator-grid">
                <div>
                  <h3 style={{ fontSize: '26px', marginBottom: '16px' }}>The Customer Experience</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    When customers scan your flyer, they are shown a friendly ratings assistant. High star ratings dynamically display tags representing your priority SEO keywords. Clicking tags crafts a perfect, natural review draft automatically, leaving it ready to copy-paste on Google.
                  </p>
                  
                  {/* Selector for Simulator Business */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button 
                      className={`btn ${simCategory === 'healthcare' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => {
                        setSimCategory('healthcare')
                        setSimSelectedTags([])
                        setSimCopied(false)
                        setSimFeedbackSubmitted(false)
                      }}
                    >
                      🏥 Medical Clinic
                    </button>
                    <button 
                      className={`btn ${simCategory === 'restaurant' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => {
                        setSimCategory('restaurant')
                        setSimSelectedTags([])
                        setSimCopied(false)
                        setSimFeedbackSubmitted(false)
                      }}
                    >
                      🍔 Restaurant
                    </button>
                    <button 
                      className={`btn ${simCategory === 'hotel' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => {
                        setSimCategory('hotel')
                        setSimSelectedTags([])
                        setSimCopied(false)
                        setSimFeedbackSubmitted(false)
                      }}
                    >
                      🏨 Hotel
                    </button>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-brand)' }}>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>SEO Objective Met:</strong>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {simCategory === 'healthcare' && `Promote '${activeSimPreset.keywords[0]}' and '${activeSimPreset.keywords[1]}' to rank ${activeSimPreset.location}'s healthcare search pack.`}
                      {simCategory === 'restaurant' && `Inject '${activeSimPreset.keywords[0]}' and '${activeSimPreset.keywords[1]}' keywords to pull hungry foodies from Google Maps.`}
                      {simCategory === 'hotel' && "Optimize local searches for clean accommodations in central Delhi near Connaught Place."}
                    </span>
                  </div>
                </div>

                {/* Mobile Phone Mockup */}
                <div>
                  <div className="phone-mockup">
                    <div className="phone-camera"></div>
                    <div className="phone-screen">
                      
                      <div className="sim-business-header">
                        <div className="sim-business-logo">
                          {simCategory === 'healthcare' ? '🏥' : simCategory === 'restaurant' ? '🍔' : '🏨'}
                        </div>
                        <h4 style={{ fontSize: '15px' }}>{activeSimPreset.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>We value your honest feedback</span>
                      </div>

                      {/* Stars selection */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Rate your experience</span>
                        <div className="sim-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={`sim-star ${star <= simRating ? 'active' : ''}`}
                              onClick={() => {
                                setSimRating(star)
                                setSimCopied(false)
                                setSimFeedbackSubmitted(false)
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Gating / Form */}
                      {simRating >= 4 ? (
                        <>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                              Tap highlights of your visit to build your review:
                            </span>
                            <div className="sim-keywords-container">
                              {activeSimPreset.keywords.map(tag => (
                                <span 
                                  key={tag}
                                  className={`sim-keyword-badge ${simSelectedTags.includes(tag) ? 'selected' : ''}`}
                                  onClick={() => {
                                    setSimSelectedTags(prev => 
                                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                    )
                                    setSimCopied(false)
                                  }}
                                >
                                  + {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Computed Review Draft */}
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Generated Draft:</span>
                            <div className="sim-review-box">
                              {renderHighlightedReviewText(simReviewText, { primary_keywords: activeSimPreset.keywords })}
                              <div className="sim-glowing-indicator">
                                <div className="sim-glowing-dot"></div>
                                <span>SEO Strength: {simSelectedTags.length > 1 ? 'Optimal (100%)' : simSelectedTags.length > 0 ? 'Good (60%)' : 'Generic'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Simulator Photo Upload mockup */}
                          <div className="image-upload-wrapper" style={{ margin: '8px 0' }}>
                            <label className="image-upload-zone" style={{ padding: '8px', fontSize: '11px' }}>
                              <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, true)} style={{ display: 'none' }} />
                              <span>📷 Add Photos (+35% Maps SEO)</span>
                            </label>
                            <div className="image-upload-previews" style={{ marginTop: '8px', gap: '6px' }}>
                              {simUploadedImages.map((img, idx) => (
                                <div key={idx} className="image-upload-preview-card" style={{ width: '45px', height: '45px' }}>
                                  <img src={img} alt="review preview" />
                                  <button type="button" className="remove-btn" style={{ width: '12px', height: '12px', fontSize: '8px' }} onClick={() => removeUploadedImage(idx, true)}>×</button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '12px' }}
                            onClick={() => {
                              setSimCopied(true)
                              const targetBiz = activeBusiness || { id: 'b_dev', name: activeSimPreset.name, category: activeSimPreset.category, googleUrl: activeSimPreset.googleUrl }
                              trackGoogleRedirect(targetBiz, simRating, simReviewText, simUploadedImages)
                            }}
                          >
                            {simCopied ? '✓ Copied Draft!' : 'Copy Draft & Open Google'}
                          </button>
                          {simCopied && (
                            <span style={{ fontSize: '10px', color: 'var(--color-success)', textAlign: 'center', display: 'block' }}>
                              Draft copied to clipboard! Opening Google Maps review window.
                            </span>
                          )}
                        </>
                      ) : (
                        // Gated Negative feedback
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                            <strong>Private Feedback Channel:</strong> We are sorry your experience wasn't ideal. Your comments will be sent directly and privately to the business owner so they can improve.
                          </div>
                          {simFeedbackSubmitted ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                              <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>✉</span>
                              <strong style={{ display: 'block', color: 'var(--color-success)' }}>Feedback Submitted!</strong>
                              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Thank you for helping us improve. The owner has been notified.
                              </p>
                            </div>
                          ) : (
                            <>
                              <textarea
                                className="form-control"
                                style={{ minHeight: '80px', fontSize: '12px' }}
                                placeholder="Tell us how we can make this right..."
                                value={simFeedbackText}
                                onChange={(e) => setSimFeedbackText(e.target.value)}
                              />
                              
                              {/* Simulator Negative Image Upload */}
                              <div className="image-upload-wrapper" style={{ margin: '4px 0' }}>
                                <label className="image-upload-zone" style={{ padding: '8px', fontSize: '11px' }}>
                                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, true)} style={{ display: 'none' }} />
                                  <span>📷 Add Photos (e.g. receipt or issue)</span>
                                </label>
                                <div className="image-upload-previews" style={{ marginTop: '8px', gap: '6px' }}>
                                  {simUploadedImages.map((img, idx) => (
                                    <div key={idx} className="image-upload-preview-card" style={{ width: '45px', height: '45px' }}>
                                      <img src={img} alt="review preview" />
                                      <button type="button" className="remove-btn" style={{ width: '12px', height: '12px', fontSize: '8px' }} onClick={() => removeUploadedImage(idx, true)}>×</button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <button 
                                className="btn btn-primary"
                                onClick={() => {
                                  const targetBiz = activeBusiness || { id: 'b_dev' }
                                  submitFeedback(
                                    targetBiz,
                                    simRating,
                                    simFeedbackText,
                                    true,
                                    simUploadedImages
                                  )
                                }}
                              >
                                Submit Private Feedback
                              </button>
                            </>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Middle Visual Sections */}
          <section className="middle-sections">
            <div className="container">
              {/* Feature 1 */}
              <div className="split-feature">
                <div className="split-content">
                  <div className="hero-badge" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <span>Step 1: Seamless QR Scanning</span>
                  </div>
                  <h3>Flyers Placed at Key Touchpoints</h3>
                  <p>
                    Print customized ReviewAI table tents, counter signs, or check-out flyers directly from your dashboard. When patients, diners, or guests scan the QR code with their mobile cameras, they are directed immediately to your tailored review helper. No apps, no signups, no friction.
                  </p>
                  <ul className="pricing-features" style={{ marginBottom: '0' }}>
                    <li>Fully dynamic QR codes connected to your dashboard profile</li>
                    <li>Tailorable call-to-action headers and custom borders</li>
                    <li>Instant page loading optimized for weak cellular connections</li>
                  </ul>
                </div>
                <div className="split-image-container">
                  <img src="/customer_scan.png" alt="A customer scanning a table tent QR code card using their phone" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="split-feature reverse">
                <div className="split-image-container">
                  <img src="/seo_boost.png" alt="A local business listing jumping to rank #1 on Google Maps with a trend arrow" />
                </div>
                <div className="split-content">
                  <div className="hero-badge">
                    <span>Step 2: Command the Maps Algorithm</span>
                  </div>
                  <h3>Turn Feedback Into Organic Map Rankings</h3>
                  <p>
                    Google doesn't just rank profiles on the number of stars—it scans review text for keyword matches like "best restaurant" or "clean clinic". By helping customers draft natural reviews loaded with geo and primary keywords, your business authority skyrockets, pushing you to the coveted #1 spot on Google Local Pack.
                  </p>
                  <ul className="pricing-features" style={{ marginBottom: '0' }}>
                    <li>Filter searches by geo-located keywords automatically</li>
                    <li>Track matched keyword counts and algorithm impact charts</li>
                    <li>Watch map page clicks and customer calls grow</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* About / Vision Story Section */}
          <section id="about" className="about-section">
            <div className="container">
              <div className="about-content">
                <div className="hero-badge">
                  <span>Our Vision</span>
                </div>
                <h2 className="about-quote">
                  "Democratizing Local SEO to Protect & Grow Neighborhood Businesses"
                </h2>
                
                <div className="about-story">
                  <p>
                    Local businesses are the true anchor of our neighborhoods—from neighborhood wellness clinics to the warm ovens of family bakeries and local tandoors. Yet in today's digital landscape, local businesses are fighting an uphill battle. Multi-million rupee franchises and venture-backed chains hire dedicated SEO agencies to dominate local map searches, swallowing up local customer traffic.
                  </p>
                  <p>
                    We built ReviewAI to level the playing field. We realized that local search algorithms aren't magic—they run on keywords. However, asking a busy customer at checkout to write "best dental clinic in Dwarka Delhi" instead of just "good service" is nearly impossible. Customers want to support you, but they are busy.
                  </p>
                  <p>
                    ReviewAI bridges this gap seamlessly. By turning key business goals into clickable suggestion tags, we help customers construct eloquent, highly optimized drafts in under ten seconds. We protect businesses from bad reviews by routing low ratings into private feedback boxes, allowing owners to resolve issues privately.
                  </p>
                  <p>
                    When you subscribe to ReviewAI, you aren't just buying SaaS software. You are investing in a mission to keep neighborhood businesses visible, active, and thriving. We give your hard work the digital ranking it deserves.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>ST</div>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Shashank Tiwari</strong>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Founder, ReviewAI</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="pricing-section">
            <div className="container">
              <div className="section-header">
                <h2>Simple, Transparent Pricing</h2>
                <p>Choose the plan that fits your growth targets. Upgrade or downgrade anytime. No setup fees.</p>
              </div>

              <div className="pricing-grid">
                {/* Starter Plan */}
                <div className="card pricing-card">
                  <h3 className="pricing-plan-name">Basic Plan</h3>
                  <div className="pricing-price">
                    ₹3,999<span> / mo</span>
                  </div>
                  <ul className="pricing-features">
                    <li>1 Business Location</li>
                    <li>Up to 200 QR Code Scans/mo</li>
                    <li>10 Preset Keyword Tags</li>
                    <li>Private Gating feedback protection</li>
                    <li>Printable QR Code Flyer download</li>
                    <li>Email support (24hr response)</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setShowAuthModal(true); setAuthTab('register'); setRegStep(1); setRegPlan('starter') }}>
                    Get Started
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="card pricing-card popular">
                  <h3 className="pricing-plan-name" style={{ color: 'var(--color-brand)', fontWeight: 700 }}>Pro Growth Plan</h3>
                  <div className="pricing-price">
                    ₹5,999<span> / mo</span>
                  </div>
                  <ul className="pricing-features">
                    <li>3 Business Locations</li>
                    <li>Unlimited Scans & Review generations</li>
                    <li>Unlimited Custom SEO Keywords</li>
                    <li>Smart AI generator templates</li>
                    <li>Custom QR flyer editor & themes</li>
                    <li>Sleek SVG Analytics history charts</li>
                    <li>Priority WhatsApp & Phone support</li>
                  </ul>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setShowAuthModal(true); setAuthTab('register'); setRegStep(1); setRegPlan('pro') }}>
                    Get Started Pro
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==========================================================================
         CUSTOMER PORTAL DIRECT SCREEN
         ========================================================================== */}
      {view === 'review-customer' && activeBusinessId && (
        (() => {
          const biz = dbBusinesses.find(b => b.shortId === activeBusinessId)
          if (!biz) {
            return (
              <div className="customer-portal-bg">
                <div className="card customer-portal-card">
                  <h3>Business Not Found</h3>
                  <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setView('landing')}>
                    Go to Homepage
                  </button>
                </div>
              </div>
            )
          }

          const reviewText = generateReviewDraft(biz, custRating, custSelectedTags)

          return (
            <div className="customer-portal-bg">
              {currentUser && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onClick={() => setView('dashboard')}
                >
                  ← Back to Dashboard
                </button>
              )}
              <div className="card customer-portal-card">
                <div className="customer-portal-logo">
                  {biz.category?.toLowerCase() === 'healthcare' || biz.category?.toLowerCase() === 'clinic' ? '🏥' : biz.category?.toLowerCase() === 'restaurant' ? '🍔' : '🏨'}
                </div>
                <h2>{biz.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                  {biz.location}
                </p>

                {custSubmitted ? (
                  <div style={{ margin: '30px 0' }}>
                    <div className="modal-success-icon">✓</div>
                    <h3 style={{ color: 'var(--color-success)', marginBottom: '8px' }}>Copied & Redirecting!</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      We have copied your review draft to your clipboard. You are being redirected to Google Maps to paste and submit your rating. Thank you for supporting us!
                    </p>
                    <a href={biz.googleUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                      Click here if not redirected
                    </a>
                  </div>
                ) : custFeedbackSubmitted ? (
                  <div style={{ margin: '30px 0' }}>
                    <div className="modal-success-icon" style={{ backgroundColor: 'var(--color-brand-bg)', color: 'var(--color-brand)' }}>✉</div>
                    <h3>Feedback Sent Privately</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      Thank you for sharing your experience. Your feedback has been sent directly to our management team to help us improve.
                    </p>
                    <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%' }} onClick={() => {
                      setCustRating(0)
                      setCustFeedbackSubmitted(false)
                    }}>
                      Back
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Star Rating Select */}
                    <div className="customer-stars-feedback">
                      <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                        How would you rate your visit?
                      </span>
                      <div className="sim-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`sim-star ${star <= custRating ? 'active' : ''}`}
                            onClick={() => {
                              setCustRating(star)
                              setCustSelectedTags([])
                            }}
                            style={{ fontSize: '30px' }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* rating flows */}
                    {custRating >= 4 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            Tap tags to include in your Google Review draft:
                          </span>
                          <div className="sim-keywords-container">
                            {[
                              ...(biz.keywords?.primary_keywords || []),
                              ...(biz.keywords?.secondary_keywords || []),
                              ...(biz.keywords?.geo_keywords || []),
                              ...(biz.keywords?.service_keywords || []),
                            ].map(tag => (
                              <span
                                key={tag}
                                className={`sim-keyword-badge ${custSelectedTags.includes(tag) ? 'selected' : ''}`}
                                onClick={() => {
                                  setCustSelectedTags(prev =>
                                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                  )
                                }}
                              >
                                + {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Text Draft Display */}
                        <div>
                          <strong style={{ fontSize: '12px', display: 'block', textAlign: 'left', marginBottom: '4px' }}>Drafted Review:</strong>
                          <div className="sim-review-box" style={{ textAlign: 'left', minHeight: '110px' }}>
                            {renderHighlightedReviewText(reviewText, biz.keywords)}
                            <div className="sim-glowing-indicator">
                              <div className="sim-glowing-dot"></div>
                              <span>SEO Strength: {custSelectedTags.length > 1 ? 'Optimal' : 'Standard'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Portal Image Upload UI */}
                        <div className="image-upload-wrapper">
                          <label className="image-upload-zone">
                            <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, false)} style={{ display: 'none' }} />
                            <span>📷 Add Photos (helps increase visibility on Google Maps)</span>
                          </label>
                          <div className="image-upload-previews">
                            {custUploadedImages.map((img, idx) => (
                              <div key={idx} className="image-upload-preview-card">
                                <img src={img} alt="customer review preview" />
                                <button type="button" className="remove-btn" onClick={() => removeUploadedImage(idx, false)}>×</button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '14px' }}
                          onClick={() => {
                            navigator.clipboard.writeText(reviewText)
                            setCustSubmitted(true)
                            trackGoogleRedirect(biz, custRating, reviewText, custUploadedImages)
                            setTimeout(() => {
                              window.open(biz.googleUrl, '_blank')
                            }, 1200)
                          }}
                        >
                          Copy & Open Google Review Page
                        </button>
                      </div>
                    ) : custRating > 0 ? (
                      // Negative gated flow
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                        <div style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                          <strong>Tell us what went wrong.</strong> Your feedback will be sent privately to the owner to resolve.
                        </div>
                        <textarea
                          className="customer-feedback-textarea"
                          placeholder="Please let us know how we can improve your next visit..."
                          value={custFeedbackText}
                          onChange={(e) => setCustFeedbackText(e.target.value)}
                        />
                        
                        {/* Customer Portal Negative Feedback Image Upload UI */}
                        <div className="image-upload-wrapper">
                          <label className="image-upload-zone">
                            <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, false)} style={{ display: 'none' }} />
                            <span>📷 Add Photos (e.g. receipt or issue)</span>
                          </label>
                          <div className="image-upload-previews">
                            {custUploadedImages.map((img, idx) => (
                              <div key={idx} className="image-upload-preview-card">
                                <img src={img} alt="customer review preview" />
                                <button type="button" className="remove-btn" onClick={() => removeUploadedImage(idx, false)}>×</button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => submitFeedback(biz, custRating, custFeedbackText, false, custUploadedImages)}
                        >
                          Submit Private Feedback
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Please select stars above to continue
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })()
      )}

      {/* ==========================================================================
         BUSINESS OWNER DASHBOARD VIEW
         ========================================================================== */}
      {view === 'dashboard' && currentUser && (
        <div className="dashboard-layout">
          {/* Dashboard Sidebar */}
          <aside className="dashboard-sidebar">
            <div>
              <div className="logo" style={{ cursor: 'pointer', marginBottom: '24px' }} onClick={() => setView('landing')}>
                <div className="logo-icon">R</div>
                <span>ReviewAI</span>
              </div>

              {activeBusiness ? (
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Active Business</span>
                  <strong style={{ display: 'block', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeBusiness.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{activeBusiness.category}</span>
                </div>
              ) : (
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>No business configured.</span>
                </div>
              )}

              <ul className="dashboard-nav">
                <li 
                  className={`dashboard-nav-item ${dashboardTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('analytics')}
                >
                  📊 Analytics Overview
                </li>
                <li 
                  className={`dashboard-nav-item ${dashboardTab === 'qr' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('qr')}
                >
                  🖨️ QR Flyer Builder
                </li>
                <li 
                  className={`dashboard-nav-item ${dashboardTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('reviews')}
                >
                  💬 Reviews Feed ({reviewsForActive.length})
                </li>
                <li 
                  className={`dashboard-nav-item ${dashboardTab === 'billing' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('billing')}
                >
                  💳 Billing & Plans
                </li>
              </ul>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeBusiness && (
                <button className="btn btn-outline" onClick={() => {
                  // Record simulated scan event
                  const newScan = {
                    id: `sc_sim_${Date.now()}`,
                    businessId: activeBusiness.id,
                    time: Date.now(),
                    converted: false
                  }
                  const updatedScans = [newScan, ...dbScans]
                  syncState(STORAGE.scans, updatedScans, setDbScans)

                  setActiveBusinessId(activeBusiness.shortId)
                  setCustRating(0)
                  setCustSubmitted(false)
                  setCustFeedbackSubmitted(false)
                  setView('review-customer')
                }}>
                  🔗 View Customer Flow
                </button>
              )}
              <button className="btn btn-secondary" style={{ color: 'var(--color-danger)' }} onClick={handleLogout}>
                🚪 Log Out
              </button>
            </div>
          </aside>

          {/* Dashboard Main Panel */}
          <main className="dashboard-main">
            <div className="dashboard-header">
              <div className="dashboard-title-group">
                <h2>Dashboard</h2>
                <p>Logged in as: {currentUser.name} ({currentUser.plan?.toUpperCase()})</p>
              </div>
            </div>

            {!activeBusiness ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <h3>No Business Profile Setup</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '12px 0 20px 0' }}>
                  There is no business connected with your account credentials. Please contact support.
                </p>
              </div>
            ) : (
              <div>
                
                {/* 1. ANALYTICS PANEL */}
                {dashboardTab === 'analytics' && (
                  <div>
                    
                    {/* Stat boxes */}
                    <div className="analytics-grid">
                      <div className="card">
                        <div className="stat-card-title">Total QR Scans</div>
                        <div className="stat-card-value">{totalScans}</div>
                        <span className="stat-card-change" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                          +{scansForActive.filter(s => s.time > Date.now() - 86400000 * 7).length} scans this week
                        </span>
                      </div>
                      <div className="card">
                        <div className="stat-card-title">Google Conversions</div>
                        <div className="stat-card-value">{totalReviews}</div>
                        <span className="stat-card-change" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                          +{publicReviews.filter(r => r.time > Date.now() - 86400000 * 7).length} reviews this week
                        </span>
                      </div>
                      <div className="card">
                        <div className="stat-card-title">Conversion Rate</div>
                        <div className="stat-card-value">{conversionRate}%</div>
                        <span className="stat-card-change" style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                          Average target maps conversion: 15%
                        </span>
                      </div>
                      <div className="card">
                        <div className="stat-card-title">Avg Review Score</div>
                        <div className="stat-card-value">{avgRating} / 5</div>
                        <span className="stat-card-change" style={{ color: '#eab308' }}>
                          {'★'.repeat(Math.round(parseFloat(avgRating)))}{'☆'.repeat(5 - Math.round(parseFloat(avgRating)))}
                        </span>
                      </div>
                    </div>

                    {totalScans === 0 ? (
                      /* Empty state layout */
                      <div className="card" style={{ textAlign: 'center', padding: '50px 20px', marginBottom: '30px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖨️</div>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Launch Your Review Campaign</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px auto', fontSize: '14px' }}>
                          Welcome to your dashboard! Your review collection is currently empty. Head over to the **QR Flyer Builder** tab to download and print your customer check-out table tents. Once a customer scans and posts, analytics stats will update instantly!
                        </p>
                        <button className="btn btn-primary" onClick={() => setDashboardTab('qr')}>
                          Go to QR Flyer Builder →
                        </button>
                      </div>
                    ) : (
                      /* Standard Chart */
                      <div className="card chart-container">
                        <div className="chart-header">
                          <div>
                            <h3 style={{ fontSize: '18px' }}>QR Code Activity History</h3>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily scans recorded over the last month</span>
                          </div>
                        </div>
                        <div className="chart-svg">
                          <svg viewBox="0 0 500 150" width="100%" height="100%" preserveAspectRatio="none">
                            {/* Gridlines */}
                            <line x1="0" y1="20" x2="500" y2="20" className="chart-gridline" />
                            <line x1="0" y1="70" x2="500" y2="70" className="chart-gridline" />
                            <line x1="0" y1="120" x2="500" y2="120" className="chart-gridline" />

                            {/* Chart Area Fill */}
                            {svgChartPath.area && (
                              <path 
                                d={svgChartPath.area} 
                                fill="url(#chart-gradient)" 
                                opacity="0.1" 
                              />
                            )}

                            {/* Chart Line Path */}
                            {svgChartPath.line && (
                              <path 
                                d={svgChartPath.line} 
                                fill="none" 
                                stroke="var(--color-brand)" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                              />
                            )}

                            {/* Chart Point Markers */}
                            {svgChartPath.coords && svgChartPath.coords.map((pt, idx) => (
                              <circle 
                                key={idx}
                                cx={pt.x}
                                cy={pt.y}
                                r="4"
                                fill="var(--bg-primary)"
                                stroke="var(--color-brand)"
                                strokeWidth="2"
                              />
                            ))}

                            {/* Gradient definitions */}
                            <defs>
                              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.4"/>
                                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* SEO Keyword Performance Summary */}
                    <div className="card">
                      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>SEO Keyword Analytics</h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                              <th style={{ padding: '12px' }}>Keyword</th>
                              <th style={{ padding: '12px' }}>SEO Tier</th>
                              <th style={{ padding: '12px' }}>Reviews Included</th>
                              <th style={{ padding: '12px' }}>Est. Ranking Boost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(activeBusiness.keywords || {}).flatMap(([type, list]) => 
                              (list || []).map(kw => {
                                const matchedCount = publicReviews.filter(r => r.text.toLowerCase().includes(kw.toLowerCase())).length
                                return (
                                  <tr key={kw} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px', fontWeight: 600 }}>{kw}</td>
                                    <td style={{ padding: '12px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                      {type.replace('_keywords', '')}
                                    </td>
                                    <td style={{ padding: '12px' }}>{matchedCount} reviews</td>
                                    <td style={{ padding: '12px', color: matchedCount > 0 ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: 600 }}>
                                      {matchedCount > 5 ? '+25% High' : matchedCount > 0 ? '+10% Medium' : 'Pending Review'}
                                    </td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. QR FLYER GENERATOR PANEL */}
                {dashboardTab === 'qr' && (
                  <div className="card">
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Print & Download QR flyer</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '30px' }}>
                      Place this flyer on checkout tables, menus, or doors. Customers scan the QR code to immediately trigger the review draft engine configured with your SEO keywords.
                    </p>

                    <div className="form-group" style={{ marginBottom: '24px', maxWidth: '500px' }}>
                      <label className="form-label" style={{ fontWeight: 700 }}>Google Review URL Target</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={activeBusiness.googleUrl} 
                        onChange={(e) => updateBusinessGoogleUrl(activeBusiness.id, e.target.value)}
                        placeholder="e.g. https://g.page/r/your-id/review"
                      />
                    </div>

                    <div className="flyer-editor-layout">
                      {/* Controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                          <label className="form-label">Flyer Heading</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={flyerHeader}
                            onChange={(e) => setFlyerHeader(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Instructional Text</label>
                          <textarea 
                            className="form-control" 
                            style={{ minHeight: '100px' }}
                            value={flyerBody}
                            onChange={(e) => setFlyerBody(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Accent Theme Color</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#0f172a'].map(c => (
                              <button 
                                key={c}
                                className="color-swatch"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: c,
                                  border: flyerBorderColor === c ? '3px solid var(--text-primary)' : '1px solid var(--border-color)',
                                  cursor: 'pointer'
                                }}
                                onClick={() => setFlyerBorderColor(c)}
                              />
                            ))}
                          </div>
                        </div>

                        <button className="btn btn-primary" onClick={() => window.print()} style={{ marginTop: '10px' }}>
                          🖨️ Print Flyer (A4 / Letter)
                        </button>
                      </div>

                      {/* Canvas Preview */}
                      <div>
                        <div 
                          className="flyer-preview-canvas" 
                          style={{ borderTop: `8px solid ${flyerBorderColor}` }}
                        >
                          <div>
                            <div className="flyer-header">{flyerHeader}</div>
                            <div className="flyer-body">{flyerBody}</div>
                          </div>

                          <div className="flyer-qr-wrapper">
                            <div className="flyer-qr-image" style={{ width: '170px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                  window.location.origin + '/?r=' + activeBusiness.shortId
                                )}`}
                                alt="Flyer QR Code" 
                                style={{ width: '150px', height: '150px' }}
                              />
                            </div>
                            <div className="flyer-short-link">
                              {window.location.host}/?r={activeBusiness.shortId}
                            </div>
                          </div>

                          <div className="flyer-footer">
                            <strong>{activeBusiness.name}</strong>
                            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>
                              Powered by ReviewAI Optimization SaaS
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}



                {/* 4. REVIEWS STREAM FEED PANEL */}
                {dashboardTab === 'reviews' && (
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px' }}>Reviews Collection</h3>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Public review drafts copied vs Private recovery reviews logged</span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className={`btn ${reviewsFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => setReviewsFilter('all')}
                        >
                          Public Google Logs ({publicReviews.length})
                        </button>
                        <button 
                          className={`btn ${reviewsFilter === 'private' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: reviewsFilter === 'private' ? 'var(--color-danger)' : '' }}
                          onClick={() => setReviewsFilter('private')}
                        >
                          🛑 Private Gated Feedback ({privateReviews.length})
                        </button>
                      </div>
                    </div>

                    <div className="reviews-dashboard-list">
                      {reviewsFilter === 'all' ? (
                        publicReviews.map(r => (
                          <div key={r.id} className="review-dashboard-item">
                            <div className="review-item-header">
                              <span className="review-item-stars">
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </span>
                              <span className="review-item-date">
                                {new Date(r.time).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="review-item-text">
                              {renderHighlightedReviewText(r.text, activeBusiness.keywords)}
                            </p>
                            {r.images && r.images.length > 0 && (
                              <div className="dashboard-review-images">
                                {r.images.map((img, index) => (
                                  <div 
                                    key={index} 
                                    className="dashboard-review-image-card"
                                    onClick={() => setActiveLightboxImage(img)}
                                  >
                                    <img src={img} alt={`review-photo-${index}`} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        privateReviews.map(r => (
                          <div key={r.id} className="review-dashboard-item" style={{ backgroundColor: 'var(--color-danger-bg)', padding: '12px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-danger)', marginBottom: '8px' }}>
                            <div className="review-item-header">
                              <span className="review-item-stars" style={{ color: 'var(--color-danger)' }}>
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </span>
                              <span className="review-item-date" style={{ color: 'var(--color-danger)' }}>
                                {new Date(r.time).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="review-item-text" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                              {renderHighlightedReviewText(r.text.replace('[PRIVATE FEEDBACK] ', ''), activeBusiness.keywords)}
                            </p>
                            {r.images && r.images.length > 0 && (
                              <div className="dashboard-review-images">
                                {r.images.map((img, index) => (
                                  <div 
                                    key={index} 
                                    className="dashboard-review-image-card"
                                    onClick={() => setActiveLightboxImage(img)}
                                  >
                                    <img src={img} alt={`review-photo-${index}`} />
                                  </div>
                                ))}
                              </div>
                            )}
                            <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '6px', display: 'block' }}>
                              ⚠️ Gated from posting public Google Maps review. Follow up with patient/client via records.
                            </span>
                          </div>
                        ))
                      )}

                      {reviewsFilter === 'all' && publicReviews.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                          No public reviews copied yet.
                        </div>
                      )}
                      {reviewsFilter === 'private' && privateReviews.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                          No private complaints recorded. Good job!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. BILLING PANEL */}
                {dashboardTab === 'billing' && (
                  <div className="card">
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Billing Summary</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', margin: '24px 0' }}>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Subscription</span>
                        <h4 style={{ fontSize: '22px', margin: '4px 0 16px 0', textTransform: 'capitalize' }}>
                          {currentUser.plan} Plan
                        </h4>
                        
                        <div style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '14px' }}>
                          ✓ Plan active & verified. Next billing date: {nextBillingDate}.
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payment Status</span>
                          <strong style={{ display: 'block', textTransform: 'capitalize', color: 'var(--color-success)' }}>
                            {currentUser.paymentStatus}
                          </strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Amount Spent</span>
                          <strong style={{ display: 'block', fontSize: '16px' }}>₹{currentUser.totalPaid || 0}</strong>
                        </div>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Invoice History</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '8px' }}>Invoice ID</th>
                            <th style={{ padding: '8px' }}>Billing Plan</th>
                            <th style={{ padding: '8px' }}>Date</th>
                            <th style={{ padding: '8px' }}>Amount</th>
                            <th style={{ padding: '8px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dbPayments.filter(p => p.userId === currentUser.id).map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '8px', fontWeight: 600 }}>{p.id.toUpperCase()}</td>
                              <td style={{ padding: '8px', textTransform: 'capitalize' }}>{p.plan}</td>
                              <td style={{ padding: '8px' }}>{new Date(p.date).toLocaleDateString()}</td>
                              <td style={{ padding: '8px' }}>₹{p.amount}</td>
                              <td style={{ padding: '8px' }}>
                                <span style={{
                                  backgroundColor: 'var(--color-success-bg)',
                                  color: 'var(--color-success)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 600
                                }}>
                                  {p.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* ==========================================================================
         INTERACTIVE FOOTER (Hidden on Dashboard View)
         ========================================================================== */}
      {view !== 'dashboard' && (
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              
              {/* Brand */}
              <div className="footer-brand">
                <div className="logo" style={{ marginBottom: '12px' }}>
                  <div className="logo-icon">R</div>
                  <span>ReviewAI</span>
                </div>
                <p>Helping local neighborhood businesses claim the #1 search ranks they deserve on Google Maps through customer reviews.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '18px', cursor: 'pointer' }}>🐦</span>
                  <span style={{ fontSize: '18px', cursor: 'pointer' }}>💼</span>
                  <span style={{ fontSize: '18px', cursor: 'pointer' }}>📷</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="footer-links-title">Product</h4>
                <ul className="footer-links">
                  <li><a href="#how-it-works">How it Works</a></li>
                  <li><a href="#simulator">Live Simulator</a></li>
                  <li><a href="#pricing">Pricing Plans</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="footer-links-title">Support</h4>
                <ul className="footer-links">
                  <li><a href="#about">Founders Story</a></li>
                  <li><span style={{ cursor: 'pointer' }}>Contact Support</span></li>
                  <li><span style={{ cursor: 'pointer' }} onClick={() => { setShowAuthModal(true); setAuthTab('login') }}>Owner Sign In</span></li>
                </ul>
              </div>

              {/* Local SEO Interactive Helper */}
              <div>
                <div className="footer-tool">
                  <div className="footer-tool-title">💡 Free Local SEO Tip Generator</div>
                  <select 
                    className="footer-tool-select"
                    value={footerCategory}
                    onChange={(e) => handleFooterTipChange(e.target.value)}
                  >
                    <option value="dental">🏥 Dental Clinic</option>
                    <option value="gym">🏋️ Gym / Fitness</option>
                    <option value="bakery">🥐 Local Bakery</option>
                    <option value="salon">💇 Hair Salon</option>
                  </select>
                  <div className="footer-tool-result">
                    {footerTip}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} ReviewAI SaaS. All rights reserved. Built with love in Delhi.</span>
              
              <div className="footer-stats">
                <div className="footer-stat-item">
                  <div className="footer-stat-indicator"></div>
                  <span><strong>{dbScans.length * 8 + 48}</strong> scans tracked today</span>
                </div>
                <div className="footer-stat-item">
                  <div className="footer-stat-indicator"></div>
                  <span><strong>{dbReviews.length * 4 + 112}</strong> reviews generated</span>
                </div>
              </div>
            </div>

          </div>
        </footer>
      )}

      {/* Lightbox Zoom Modal */}
      {activeLightboxImage && (
        <div className="lightbox-backdrop" onClick={() => setActiveLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-close" onClick={() => setActiveLightboxImage(null)}>×</span>
            <img src={activeLightboxImage} alt="Enlarged review photo" />
          </div>
        </div>
      )}
    </div>
  )
}
