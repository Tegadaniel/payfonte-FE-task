# Payfonte Countries

A Next.js app that integrates with the PayFusion public API to browse, search, and explore country data — phone codes, currencies, flags, and locale info.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test       # run unit tests (Vitest)
npm run build  # production build
```

## Key Decisions

### Data fetching — React Query
All country data is fetched once via `useQuery` with a 5-minute `staleTime`. This means the API is only hit on the first load (or after 5 minutes), and the data stays in memory for instant re-filtering without further network requests.

### Client-side filtering
Filtering and search happen entirely in the browser using `useMemo` over the cached list. This keeps interactions instant and avoids a round-trip per keystroke. The tradeoff is that the full list is loaded upfront — acceptable here since the dataset is small.

### Debounced search
The search input is debounced at 300 ms via a custom `useDebounce` hook, so the filter only recalculates after the user stops typing rather than on every keypress.

### Infinite scroll
The country list renders 20 cards at a time. An `IntersectionObserver` watches a sentinel element at the bottom of the list and loads the next 20 when it enters the viewport — no third-party library required.

### Locale switching
Users can tap "Set as my locale" inside any country's detail drawer. The selected country is persisted to `localStorage` and surfaced in the header. A BCP-47 locale tag (`en-{countryCode}`) is derived from the selection and used with `Intl.NumberFormat` to show how currency amounts look in that locale — demonstrating real locale-aware formatting.

### State management
No global state library. React Query owns server state; `useState` in the page component owns UI state (search query, selected country, home locale). The app is small enough that prop-drilling stays manageable.

### Testing
Vitest + jsdom. The component test uses `react-dom/client` + `act()` (React 19's async-aware test wrapper) to flush renders before asserting on the DOM.

## Project Structure

```
app/
  layout.tsx        # QueryClientProvider root
  page.tsx          # Main page — search, filter, list, drawer
components/
  CountryCard.tsx   # List card for each country
  CountryDrawer.tsx # Slide-up detail panel + locale toggle
  SearchBar.tsx     # Search input + filter tabs
  States.tsx        # Loading, error, and empty state UI
hooks/
  useCountries.ts   # React Query fetch + client-side filter
  useDebounce.ts    # Debounce hook
  useLocale.ts      # Home locale state + localStorage persistence
types/
  country.ts        # Country, CountryFilters, FilterKey types
```

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **TanStack React Query v5**
- **Vitest** + jsdom for testing
# payfonte-FE-task
