

# Fix Gen AI Modules: Switch from OpenAI to Lovable AI

## Problem

All 6 generative AI edge functions currently call the OpenAI API directly using `OPENAI_API_KEY`. This is likely failing or unreliable. Additionally, `generate-measure-debrief` is **entirely commented out** (non-functional).

## Solution

Rewrite all 6 edge functions to use the **Lovable AI Gateway** (`https://ai.gateway.lovable.dev/v1/chat/completions`) with the pre-configured `LOVABLE_API_KEY`. The `LOVABLE_API_KEY` is already available as a Supabase secret.

## Functions to Update

| Edge Function | Current State | Change |
|---|---|---|
| `generate-description` | Uses OpenAI directly | Switch to Lovable AI |
| `generate-ideas` | Uses OpenAI directly | Switch to Lovable AI |
| `generate-metrics` | Uses OpenAI directly | Switch to Lovable AI |
| `generate-implementation-plan` | Uses OpenAI directly | Switch to Lovable AI |
| `generate-budget` | Uses OpenAI directly | Switch to Lovable AI |
| `generate-measure-debrief` | Entirely commented out | Rewrite using Lovable AI |

## What Changes in Each Function

For each function, the core change is the same:

1. Replace `OPENAI_API_KEY` with `LOVABLE_API_KEY`
2. Replace `https://api.openai.com/v1/chat/completions` with `https://ai.gateway.lovable.dev/v1/chat/completions`
3. Replace `gpt-4o-mini` model with `google/gemini-3-flash-preview`
4. Update the `Authorization` header accordingly
5. Keep all existing prompts, response parsing, and error handling intact

For `generate-measure-debrief`: uncomment and rewrite the entire function with Lovable AI.

## Technical Details

- **No frontend changes needed** -- the client code already calls these functions via `supabase.functions.invoke()`, which remains the same
- **No new secrets needed** -- `LOVABLE_API_KEY` is already configured
- **No database changes needed**
- All 6 functions will be redeployed automatically

