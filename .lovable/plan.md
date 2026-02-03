
# Fix jsPDF Security Vulnerability (CVE-2026-24133)

## Issue Summary

Your project has a **high severity (8.7/10)** security vulnerability in the `jspdf` package:

- **Vulnerability**: Denial of Service via Unvalidated BMP Dimensions in BMPDecoder
- **Current version**: ^4.0.0
- **Patched version**: 4.1.0+
- **Impact**: Malicious BMP files can cause memory exhaustion and application crashes

---

## Solution

Update the jsPDF dependency in `package.json` from `^4.0.0` to `^4.1.0`.

---

## Technical Changes

### File: `package.json`

```text
BEFORE (line 63):
"jspdf": "^4.0.0",

AFTER:
"jspdf": "^4.1.0",
```

---

## Summary

| File | Change |
|------|--------|
| package.json | Update jspdf version from ^4.0.0 to ^4.1.0 |

This is a straightforward version bump that patches the security vulnerability. No code changes are required since jsPDF is used internally by html2pdf.js in your project.
