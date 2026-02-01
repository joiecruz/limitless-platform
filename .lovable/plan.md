
# Fix Course Access Granted Dialog Navigation

## Problem Summary

The `CourseAccessGrantedDialog` component has two issues:
1. **Wrong URL format**: Navigates to `/dashboard/courses/${course.slug}` instead of `/dashboard/courses/${course.id}/lessons`
2. **Missing enrollment**: Users have `user_course_access` but need to also be added to `enrollments` table to actually start learning

---

## Solution Overview

```text
CURRENT FLOW (BROKEN):
  "Go to Course" → /dashboard/courses/course-slug → "Course Not Found" error

FIXED FLOW:
  "Go to Course" → Auto-enroll user → /dashboard/courses/UUID/lessons → Lessons load correctly
```

---

## Technical Changes

### File: `src/components/dashboard/CourseAccessGrantedDialog.tsx`

**Change 1: Fix Navigation URL**

Update `handleGoToCourse` to use the course UUID and navigate directly to lessons:

```typescript
// BEFORE (line 64):
navigate(`/dashboard/courses/${course.slug}`);

// AFTER:
navigate(`/dashboard/courses/${course.id}/lessons`);
```

**Change 2: Auto-Enroll User**

Add enrollment logic when clicking "Go to Course" so users can immediately start learning:

```typescript
const handleGoToCourse = async () => {
  if (!course) return;
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();

      // If not enrolled, create enrollment
      if (!existingEnrollment) {
        await supabase
          .from('enrollments')
          .insert({
            course_id: course.id,
            user_id: user.id,
            progress: 0
          });
      }
    }
  } catch (err) {
    console.error('Error enrolling user:', err);
    // Continue navigation even if enrollment fails
  }

  setOpen(false);
  navigate(`/dashboard/courses/${course.id}/lessons`);
};
```

**Change 3: Remove Unnecessary Slug from CourseInfo Interface**

Since we no longer need the slug, simplify the interface and query:

```typescript
// BEFORE:
interface CourseInfo {
  id: string;
  title: string;
  slug: string;
}

// AFTER:
interface CourseInfo {
  id: string;
  title: string;
}

// Update query to not select slug
const { data: courseData, error } = await supabase
  .from('courses')
  .select('id, title')  // Remove 'slug'
  .eq('id', grantedCourseId)
  .maybeSingle();
```

---

## Summary of Changes

| Line(s) | Change |
|---------|--------|
| 15-19 | Remove `slug` from `CourseInfo` interface |
| 40-42 | Update query to select only `id, title` |
| 61-66 | Make `handleGoToCourse` async, add enrollment logic, fix navigation URL |

---

## Expected Behavior After Fix

1. User signs up via course invite
2. `user_course_access` is granted automatically
3. Dashboard shows "Course Access Granted" dialog
4. User clicks "Go to Course"
5. System auto-enrolls user in `enrollments` table
6. User is navigated to `/dashboard/courses/UUID/lessons`
7. Lessons load correctly and user can start learning
