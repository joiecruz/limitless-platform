

# Security Vulnerability Remediation Plan

## Summary

Your interns identified 27 vulnerabilities across dependency audits and web application scans. After analyzing each one against your actual codebase, here's what's actionable vs. not applicable, and the recommended course of action.

---

## Category 1: Direct Dependency Fixes (We Can Fix)

These are packages you directly control in package.json.

### CRITICAL

| Vulnerability | Action |
|---|---|
| **swiper** - Prototype Pollution (CVE-2026-27212) | **Remove entirely** -- not used anywhere in the codebase. Already flagged for removal. |
| **jspdf <=4.1.0** - DoS | Already at `^4.1.0`. **Update to `^4.2.0`** or latest to ensure the fix is pulled. |

### HIGH

| Vulnerability | Action |
|---|---|
| **html2pdf.js <0.14.0** - XSS | Currently at `^0.10.3`. **Replace with jsPDF** (already installed) for PDF export in `Measure.tsx`. Then remove html2pdf.js. |
| **html2canvas** | **Remove entirely** -- not used anywhere in the codebase (already a dead dependency). |
| **React Router <=1.23.1** - XSS Open Redirect | You're on `react-router-dom ^6.26.2` which is well above the affected range. **Not actually vulnerable** -- this is a false positive. |

### MEDIUM

| Vulnerability | Action |
|---|---|
| **quill =2.0.3** - XSS via HTML export | Used in `DocumentEditor.tsx`. **Update to quill ^2.1.0** if available, or sanitize all Quill HTML output through DOMPurify (already installed). |
| **mammoth 0.3.25-1.10.0** - Directory Traversal | Currently at `^1.9.1`. **Update to ^1.11.0** or latest patched version. |
| **slate** packages | **Remove entirely** -- `slate`, `slate-history`, `slate-react` are not imported anywhere in the codebase. Dead dependencies. |

## Category 2: Transitive/Dev Dependencies (Limited Control)

These are sub-dependencies pulled in by other packages. They don't ship to production in most cases.

| Vulnerability | Assessment |
|---|---|
| **glob, minimatch, brace-expansion** | Build-time dev tools only. Not in production bundles. **Low real-world risk.** |
| **esbuild <=0.24.2** | Dev server only, not production. Updating Vite to latest will pull newer esbuild. |
| **ajv <6.14.0** | Transitive dependency. ReDoS risk is low in browser context. |
| **js-yaml, lodash, lodash-es** | Transitive. Prototype pollution mitigated by modern JS engines. |
| **nanoid <3.3.8** | Transitive (used by postcss/vite internally). |
| **markdown-it** | Transitive (likely from tiptap). ReDoS is low risk. |
| **@eslint/plugin-kit** | Dev-only tool, never ships to production. |

**Action for all transitive deps:** Update Vite from `^5.4.19` to latest `^5.x` or `^6.x` to pull newer transitive dependencies.

## Category 3: HTTP Security Headers (Server Configuration)

These are **not fixable in application code** -- they require server/hosting configuration. Since you're hosted on Lovable (preview) and a custom domain, these headers need to be set at the hosting/CDN layer (e.g., Cloudflare).

| Finding | Fix Location |
|---|---|
| Missing X-Frame-Options | Cloudflare response header rule: `X-Frame-Options: SAMEORIGIN` |
| Missing X-Content-Type-Options | Cloudflare: `X-Content-Type-Options: nosniff` |
| Missing Strict-Transport-Security | Cloudflare: `Strict-Transport-Security: max-age=31536000; includeSubDomains` |
| Content Security Policy issues (wildcard, unsafe-inline, missing fallback) | Cloudflare: Define a strict CSP header |
| Server version leakage | Cloudflare: Strip or customize the Server header |
| Cookie SameSite attribute | Supabase auth cookies -- managed by Supabase SDK |
| Timestamp disclosure | Informational, not actionable |
| Sub Resource Integrity | No external CDN scripts are loaded; all JS is bundled. **Not applicable.** |
| Cross-Domain JS inclusion | Relates to Supabase JS SDK loaded from supabase CDN. **Expected behavior.** |

**Recommendation:** Add Cloudflare Transform Rules for security headers. I can provide the exact header values, but these must be configured in your Cloudflare dashboard, not in code.

---

## Implementation Steps (What I Will Do)

### Step 1: Remove unused packages
Remove `swiper`, `slate`, `slate-history`, `slate-react`, and `html2canvas` from package.json.

### Step 2: Replace html2pdf.js with jsPDF
Rewrite the PDF export in `Measure.tsx` to use `jspdf` (already installed), then remove `html2pdf.js`.

### Step 3: Update vulnerable packages
- Update `jspdf` to `^4.2.0`
- Update `mammoth` to `^1.11.0`

### Step 4: Harden Quill output
Add DOMPurify sanitization to all Quill HTML output in `DocumentEditor.tsx` (DOMPurify is already installed).

### Step 5: Update Vite
Update `vite` to latest `^5.x` to pull patched transitive dependencies (esbuild, nanoid, etc.).

---

## What You Need to Do (Outside Code)

Configure these **Cloudflare response headers** (or equivalent at your hosting provider):

```text
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

For CSP, a starter policy would be:
```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; font-src 'self';
```

I will note the exact Cloudflare steps after implementation.

