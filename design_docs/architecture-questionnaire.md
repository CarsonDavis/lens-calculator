# Architecture Questionnaire

## 1. Calculation Engine
a) Should the math/logic be a separate package that could be used without the UI?
yes. this sounds good for a modularity, testing and expensibility standpoint
b) Do we need to support different unit systems (metric/imperial)?
yes. some old lenses are measured in inches, as are many film formats such as large format. 

## 2. State & Data Flow
a) Derived values — recalculate on every render, or memoize/cache?
recalculate
b) Override tracking — how do we know a field is overridden? (flag per field, or just "non-null means overridden")
override boolean, this also should affect the css
c) Should source and target be symmetric data structures, or different shapes?
different is fine. we can consolodate later if it turns out they are the same


## 3. Format Data
a) Formats baked into the app, or loaded from a separate file/endpoint?
separate file
b) Custom formats — ephemeral (lost on refresh) or persistable (localStorage)?
persistable
c) Should users be able to save/name custom formats?
sure, but it needs to be CLEAN and simple, no bloat

## 4. Persistence
a) Save any state to URL (shareable links)?
yes
b) Save state to localStorage (remembers last session)?
yes
c) Any user accounts / cloud sync?
no

## 5. Deployment & Hosting
a) Static site (GitHub Pages, Netlify, Vercel) or needs a server?
I don't think we have enough here to warrant a server?
b) Any analytics or tracking?
nah
c) Offline support / PWA?
no

## 6. Extensibility
a) Plugin system for additional calculations or formats?
no
b) API for embedding the calculator elsewhere?
no

## 7. Platform
a) Web only, or also native mobile?
should look phenomenal on a phone. so native mobile i guess
b) Responsive design (adapts to mobile), or desktop-focused?
who uses desktop anymore?

## 8. Testing
a) Unit tests for calculations?
yes
b) Integration / E2E tests for UI?
yes
c) Visual regression tests for the sensor overlay?
yes

## 9. Accessibility
a) Full WCAG compliance, or best-effort?
yes
b) Keyboard navigation priority?
yes

## 10. Performance
a) Any concerns about calculation speed?
nah
b) Sensor overlay — SVG, Canvas, or CSS?
svg