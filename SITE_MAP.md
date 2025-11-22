# 🗺️ InspectIQ Complete Site Map

```
InspectIQ Platform
│
├── 🌐 MARKETING SITE (Public)
│   │
│   ├── 🏠 Home & Core
│   │   ├── / ........................... Landing Page
│   │   ├── /about ...................... About Us
│   │   ├── /contact .................... Contact
│   │   └── /pricing .................... Pricing
│   │
│   ├── 🎯 Solutions (Audience-Specific)
│   │   ├── /solutions/inspectors ....... For Professional Inspectors
│   │   ├── /solutions/homeowners ....... For Homeowners & Renters
│   │   └── /solutions/property-managers  For Property Management
│   │
│   ├── 📚 Resources & Education
│   │   ├── /blog ....................... Blog & Articles
│   │   ├── /case-studies ............... Customer Success Stories
│   │   ├── /comparison ................. Traditional vs AI Comparison
│   │   ├── /faq ........................ Frequently Asked Questions
│   │   ├── /demo ....................... Interactive Demo & Sample Report
│   │   └── /how-ai-works ............... AI Technology Explanation
│   │
│   └── 🔐 Authentication
│       ├── /login ...................... Sign In
│       └── /register ................... Sign Up / Free Trial
│
└── 💼 APPLICATION (Protected - Requires Login)
    │
    ├── /app ............................ Dashboard (Home)
    │   ├── Recent inspections
    │   ├── Quick stats
    │   └── Quick actions
    │
    ├── /app/properties ................. Properties List
    │   ├── All properties
    │   ├── Search & filter
    │   └── Add new property
    │
    ├── /app/properties/:id ............. Property Detail
    │   ├── Property information
    │   ├── Inspection history
    │   ├── Photos & documents
    │   └── Start new inspection
    │
    ├── /app/inspections ................ Inspections List (→ Dashboard)
    │
    ├── /app/inspections/new ............ New Inspection
    │   ├── Select property
    │   ├── Upload photos
    │   ├── AI analysis
    │   └── Generate report
    │
    └── /app/inspections/:id ............ Inspection Detail
        ├── View findings
        ├── Edit notes
        ├── Download PDF
        └── Share report
```

---

## 📊 Page Hierarchy

### Level 1: Main Navigation
- Home (Landing)
- Solutions (Dropdown)
- Resources (Dropdown)
- Pricing
- About
- Contact

### Level 2: Solution Pages
- For Inspectors
- For Homeowners
- For Property Managers

### Level 3: Resource Pages
- Blog
- Case Studies
- Comparison
- FAQ
- Demo
- How AI Works

### Level 4: Application Pages
- Dashboard
- Properties
- Inspections
- Settings (future)
- Profile (future)

---

## 🎯 User Journeys

### Journey 1: Homeowner (B2C)
```
1. Google Search "rental inspection app"
   ↓
2. Land on /solutions/homeowners
   ↓
3. Read about deposit protection
   ↓
4. Check /pricing (Starter $29/mo)
   ↓
5. View /demo to see how it works
   ↓
6. Read /faq for questions
   ↓
7. Click "Start Free Trial"
   ↓
8. /register → /app
```

### Journey 2: Professional Inspector (B2B)
```
1. LinkedIn Ad → /solutions/inspectors
   ↓
2. See ROI calculator ($50k+ potential)
   ↓
3. Read /case-studies (Metro Inspections)
   ↓
4. Compare /comparison (vs traditional)
   ↓
5. Check /pricing (Professional $99/mo)
   ↓
6. /contact for demo call
   ↓
7. After demo → /register
   ↓
8. Onboarding → /app
```

### Journey 3: Property Manager (Enterprise)
```
1. Google Search "property management inspection software"
   ↓
2. Land on /solutions/property-managers
   ↓
3. See scale benefits (500+ units)
   ↓
4. Read /case-studies (Riverside PM)
   ↓
5. Check /how-ai-works (technology)
   ↓
6. /contact for enterprise pricing
   ↓
7. Sales call + custom demo
   ↓
8. Contract → /register (team accounts)
```

### Journey 4: Organic Search (SEO)
```
1. Google Search "how to document rental property"
   ↓
2. Land on /blog article
   ↓
3. Read helpful content
   ↓
4. Click CTA "Try InspectAI Free"
   ↓
5. Land on /solutions/homeowners
   ↓
6. Follow B2C journey above
```

---

## 🔄 Internal Linking Strategy

### From Landing Page
- Solutions pages (3 links)
- Pricing (2 links)
- Demo (2 links)
- Register (3 links)

### From Solution Pages
- Pricing (2 links)
- Demo (1 link)
- Case Studies (1 link)
- Register (3 links)

### From Resource Pages
- Related resources (2-3 links)
- Solution pages (1 link)
- Register (2 links)

### From Blog
- Related articles (3 links)
- Solution pages (1 link)
- Case Studies (1 link)
- Register (1 link)

---

## 📱 Mobile Navigation

### Hamburger Menu Structure
```
☰ Menu
├── Solutions
│   ├── For Inspectors
│   ├── For Homeowners
│   └── For Property Managers
├── Resources
│   ├── Blog
│   ├── Case Studies
│   ├── Comparison
│   ├── FAQ
│   ├── Demo
│   └── How AI Works
├── Pricing
├── About
├── Contact
├── ─────────────
├── Sign In
└── Get Started (CTA)
```

---

## 🎨 Page Templates

### Template A: Marketing Page
- MarketingNav (sticky header)
- Hero section
- Content sections
- CTA sections
- MarketingFooter

**Used by:** Landing, About, Contact

### Template B: Solution Page
- MarketingNav
- Hero with value prop
- Features grid
- ROI calculator
- Testimonials
- Pricing preview
- Multiple CTAs
- MarketingFooter

**Used by:** For Inspectors, For Homeowners, For Property Managers

### Template C: Resource Page
- MarketingNav
- Page header
- Content area
- Sidebar (optional)
- Related content
- CTA section
- MarketingFooter

**Used by:** Blog, Case Studies, FAQ, Comparison

### Template D: Application Page
- App header (different from marketing)
- Sidebar navigation
- Main content area
- No footer (app chrome)

**Used by:** Dashboard, Properties, Inspections

---

## 🔍 SEO Page Priority

### Priority 1 (Most Important)
1. Landing Page (/)
2. For Inspectors (/solutions/inspectors)
3. For Homeowners (/solutions/homeowners)
4. Pricing (/pricing)
5. Blog (/blog)

### Priority 2 (Important)
6. For Property Managers (/solutions/property-managers)
7. Demo (/demo)
8. How AI Works (/how-ai-works)
9. Case Studies (/case-studies)
10. Comparison (/comparison)

### Priority 3 (Supporting)
11. FAQ (/faq)
12. About (/about)
13. Contact (/contact)

---

## 📈 Conversion Paths

### Path 1: Direct Signup (Fastest)
```
Landing → Register → App
(1 click, 0 pages)
```

### Path 2: Research & Signup (Common)
```
Landing → Solution Page → Pricing → Register → App
(3 clicks, 3 pages)
```

### Path 3: Deep Research (Cautious)
```
Landing → Solution → Demo → Case Studies → FAQ → Pricing → Register → App
(6 clicks, 6 pages)
```

### Path 4: Sales-Assisted (Enterprise)
```
Landing → Solution → Contact → [Sales Call] → Register → App
(2 clicks + call)
```

---

## 🎯 Call-to-Action Map

### Primary CTAs (Blue buttons)
- "Start Free Trial" → /register
- "Get Started" → /register
- "Try It Free" → /register

**Appears on:** All marketing pages (2-4 times per page)

### Secondary CTAs (White/outlined)
- "View Demo" → /demo
- "Schedule Demo" → /contact
- "Contact Sales" → /contact
- "See Pricing" → /pricing

**Appears on:** Solution pages, resource pages

### Tertiary CTAs (Text links)
- "Learn More" → Relevant page
- "Read Case Study" → /case-studies
- "Read Article" → /blog/[slug]

**Appears on:** Throughout site as contextual links

---

## 📊 Analytics Goals

### Macro Conversions
1. Free trial signup (/register)
2. Contact form submission (/contact)
3. Demo request (/demo)

### Micro Conversions
1. Pricing page view
2. Demo page view
3. Case study read
4. Blog article read
5. Newsletter signup
6. Video play (when added)

---

## 🚀 Launch Checklist

### Pre-Launch
- [x] All pages created
- [x] Navigation working
- [x] Mobile responsive
- [x] SEO meta tags
- [ ] Google Analytics installed
- [ ] Forms connected to backend
- [ ] SSL certificate installed
- [ ] Domain configured

### Post-Launch
- [ ] Submit sitemap to Google
- [ ] Set up Google Search Console
- [ ] Create Facebook Pixel
- [ ] Launch Google Ads
- [ ] Start content marketing
- [ ] Monitor analytics
- [ ] A/B test landing page
- [ ] Collect customer testimonials

---

## 📝 Content Inventory

### Pages: 13 marketing + 5 app = 18 total
### Components: 10+ reusable
### Routes: 18 defined
### CTAs: 30+ across site
### Trust signals: 10+ badges/guarantees
### Testimonials: 6 customer quotes
### Case studies: 3 detailed stories
### Blog posts: 6 articles (placeholders)
### FAQ items: 20 questions

---

## 🎉 You Have Everything!

Your complete site includes:
- ✅ 13 marketing pages
- ✅ 5 application pages
- ✅ Full navigation system
- ✅ Mobile-responsive design
- ✅ SEO optimization
- ✅ Conversion-focused copy
- ✅ Social proof & trust signals
- ✅ Multiple user journeys
- ✅ Clear CTAs throughout
- ✅ Professional footer

**Ready to launch and grow!** 🚀
