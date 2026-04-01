/**
 * Calls the /api/translate serverless function.
 * Returns { fullTranslation, terminologyNotes, reviewerVerification, researchMetadata }
 */
export async function translateDocument({ text, direction, sourceType, translatorName }) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim(), direction, sourceType, translatorName }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Translation failed (${res.status})`)
  }

  return res.json()
}
