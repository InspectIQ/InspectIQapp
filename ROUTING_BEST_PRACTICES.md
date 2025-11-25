# Routing Best Practices

## 🎯 Problem We Solved

Previously, navigation links were hardcoded throughout the app, leading to:
- Broken links when routes changed
- Inconsistent `/app` prefix usage
- Hard-to-maintain navigation code
- 404 errors in production

## ✅ Solution: Centralized Route Definitions

We created `frontend/src/utils/routes.ts` to centralize all route definitions.

## 📋 How to Use

### 1. Import the Routes

```typescript
import { APP_ROUTES, PUBLIC_ROUTES } from '../utils/routes'
```

### 2. Use in Navigation

**❌ DON'T DO THIS:**
```typescript
navigate('/app/inspections/123')
<Link to="/app/properties">Properties</Link>
```

**✅ DO THIS:**
```typescript
navigate(APP_ROUTES.inspectionDetail(123))
<Link to={APP_ROUTES.properties}>Properties</Link>
```

### 3. Available Routes

#### Authenticated App Routes (APP_ROUTES)
```typescript
APP_ROUTES.dashboard              // '/app'
APP_ROUTES.properties             // '/app/properties'
APP_ROUTES.propertyDetail(id)     // '/app/properties/:id'
APP_ROUTES.inspections            // '/app/inspections'
APP_ROUTES.inspectionDetail(id)   // '/app/inspections/:id'
APP_ROUTES.newInspection          // '/app/inspections/new'
APP_ROUTES.newInspectionWithProperty(propertyId)  // '/app/inspections/new?property=:id'
APP_ROUTES.admin                  // '/app/admin'
APP_ROUTES.adminUsers             // '/app/admin/users'
APP_ROUTES.adminAnalytics         // '/app/admin/analytics'
APP_ROUTES.adminSystem            // '/app/admin/system'
```

#### Public Marketing Routes (PUBLIC_ROUTES)
```typescript
PUBLIC_ROUTES.home                // '/'
PUBLIC_ROUTES.login               // '/login'
PUBLIC_ROUTES.register            // '/register'
PUBLIC_ROUTES.about               // '/about'
PUBLIC_ROUTES.contact             // '/contact'
PUBLIC_ROUTES.pricing             // '/pricing'
PUBLIC_ROUTES.demo                // '/demo'
// ... and more
```

## 🔧 Adding New Routes

When adding a new route:

1. **Add it to `routes.ts` first:**
```typescript
export const APP_ROUTES = {
  // ... existing routes
  newFeature: '/app/new-feature',
  newFeatureDetail: (id: number | string) => `/app/new-feature/${id}`,
} as const
```

2. **Use it in your components:**
```typescript
import { APP_ROUTES } from '../utils/routes'

// In your component
<Link to={APP_ROUTES.newFeature}>New Feature</Link>
navigate(APP_ROUTES.newFeatureDetail(123))
```

## 🎨 Benefits

✅ **Type-safe** - TypeScript will catch typos
✅ **Centralized** - Change route in one place
✅ **Consistent** - All routes use the same pattern
✅ **Maintainable** - Easy to find and update routes
✅ **No broken links** - If route changes, update once

## 🚨 Rules

1. **NEVER hardcode routes** in components
2. **ALWAYS import from routes.ts**
3. **ALL authenticated routes** must start with `/app`
4. **ALL public routes** must NOT start with `/app`
5. **Add new routes to routes.ts** before using them

## 📝 Examples

### Navigation with useNavigate
```typescript
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../utils/routes'

const MyComponent = () => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(APP_ROUTES.inspectionDetail(123))
  }
  
  return <button onClick={handleClick}>View Inspection</button>
}
```

### Links with React Router
```typescript
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../utils/routes'

const MyComponent = () => {
  return (
    <Link to={APP_ROUTES.properties}>
      View Properties
    </Link>
  )
}
```

### Dynamic Routes
```typescript
import { APP_ROUTES } from '../utils/routes'

// With ID from props/state
<Link to={APP_ROUTES.propertyDetail(property.id)}>
  {property.address}
</Link>

// With query parameters
<Link to={APP_ROUTES.newInspectionWithProperty(propertyId)}>
  Start Inspection
</Link>
```

## 🔍 Finding Hardcoded Routes

To find any remaining hardcoded routes:

```bash
# Search for hardcoded /app routes
grep -r "to=\"/app" frontend/src/

# Search for hardcoded navigate calls
grep -r "navigate('/app" frontend/src/
```

## ✨ Updated Files

The following files now use centralized routes:
- ✅ `frontend/src/pages/Dashboard.tsx`
- ✅ `frontend/src/pages/NewInspection.tsx`
- ✅ `frontend/src/pages/PropertyDetail.tsx`
- ✅ `frontend/src/components/Layout.tsx`

## 🎯 Next Steps

When adding new features:
1. Add route to `routes.ts`
2. Import and use in components
3. Never hardcode routes
4. Test navigation thoroughly

---

**Remember:** One source of truth for all routes = fewer bugs! 🎉
