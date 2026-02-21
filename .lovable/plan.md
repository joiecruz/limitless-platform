

# Fix: Remove Unused `swiper` Package (CVE-2026-27212)

## The Problem

GitHub Dependabot flagged a **critical severity** prototype pollution vulnerability (CVE-2026-27212) in the `swiper` package.

## The Fix

After searching the entire codebase, `swiper` is **not imported or used anywhere** in the project. The fix is simply to **remove it from `package.json`**, which eliminates the vulnerability entirely with zero risk of breaking anything.

## What Changes

| File | Change |
|------|--------|
| `package.json` | Remove `swiper` from dependencies |

This is a one-line change that will resolve both Dependabot alerts (package.json and package-lock.json).

