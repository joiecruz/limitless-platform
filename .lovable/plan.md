

# Make the Projects Module Responsive

## Problem
The projects module has several components that don't adapt well to mobile/tablet screens. Key issues include the 8-step navigation bar overflowing, fixed padding, and side-by-side layouts that don't stack on small screens.

## Changes

### 1. ProjectNavBar - Mobile Step Navigation
**File:** `src/components/projects/ProjectNavBar.tsx`

The nav bar displays 8 steps horizontally with icons and labels. On mobile, this overflows.

- Add horizontal scroll with `overflow-x-auto` and hide the scrollbar
- On small screens, hide step labels and show only icons (using a `hidden sm:inline` pattern)
- Alternatively, replace with a dropdown/select menu on mobile using the `useIsMobile` hook
- Recommended approach: horizontally scrollable strip with smaller touch targets on mobile

### 2. Projects List Page - Padding and Grid
**File:** `src/pages/projects/Projects.tsx`

- Change `px-8` to `px-4 sm:px-8` for mobile padding
- Change heading `text-3xl` to `text-2xl sm:text-3xl`
- The grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` is already responsive -- no change needed

### 3. Instruction Boxes - Stack on Mobile
**Files:** `BudgetTab.tsx`, `ImplementationPlanTab.tsx`, `FilesTab.tsx`, `MeasurementFrameworkTab.tsx`

All instruction boxes use `flex items-center` with a button beside the text. On mobile the button gets squished.

- Change to `flex flex-col sm:flex-row sm:items-center` so they stack vertically on mobile
- Change button margin from `ml-6` to `mt-4 sm:mt-0 sm:ml-6`
- Make buttons full-width on mobile with `w-full sm:w-auto`

### 4. ProjectBanner - Already Partially Responsive
**File:** `src/components/projects/ProjectBanner.tsx`

- Already uses `flex-col md:flex-row` -- mostly fine
- Adjust image container from `w-1/2 md:w-1/3` to `w-full md:w-1/3` on mobile

### 5. ProjectBrief - Progress Bar and Forms
**File:** `src/pages/projects/project-brief/ProjectBrief.tsx`

- Ensure form inputs and progress bar adapt to narrower widths
- Add responsive padding adjustments

### 6. Design Thinking Pages (Empathize, Define, Ideate, etc.)
- Ensure StepCard components and document editors respect mobile widths
- Sticky notes grid in Ideate should be single-column on mobile (check current grid setup)

## Summary of Files to Edit

| File | Change |
|---|---|
| `ProjectNavBar.tsx` | Scrollable nav, icon-only on mobile |
| `Projects.tsx` | Responsive padding |
| `BudgetTab.tsx` | Stack instruction box on mobile |
| `ImplementationPlanTab.tsx` | Stack instruction box on mobile |
| `FilesTab.tsx` | Stack instruction box on mobile |
| `MeasurementFrameworkTab.tsx` | Stack instruction box on mobile |
| `ProjectBanner.tsx` | Fix image width on mobile |
| `ProjectBrief.tsx` | Responsive padding |

## Technical Notes

- Uses the existing `useIsMobile` hook (breakpoint: 768px) where conditional rendering is needed
- Most changes are Tailwind class adjustments (`sm:`, `md:` prefixes) -- minimal code impact
- No new dependencies required
