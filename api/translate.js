import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseOutput(raw) {
  const extract = (label, nextLabel) => {
    const start = raw.indexOf(label)
    if (start === -1) return ''
    const contentStart = start + label.length
    const end = nextLabel ? raw.indexOf(nextLabel, contentStart) : raw.length
    return raw.slice(contentStart, end === -1 ? raw.length : end).trim()
  }

  return {
    fullTranslation:      extract('FULL TRANSLATION:', 'TERMINOLOGY / TRANSLATION NOTES:'),
    terminologyNotes:     extract('TERMINOLOGY / TRANSLATION NOTES:', 'REVIEWER VERIFICATION NOTES:'),
    reviewerVerification: extract('REVIEWER VERIFICATION NOTES:', 'RESEARCH / CONTRIBUTION METADATA:'),
    researchMetadata:     extract('RESEARCH / CONTRIBUTION METADATA:', null),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, direction, sourceType = 'General Medical Document', translatorName = 'Anonymous' } = req.body || {}

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided' })
  }

  const directionLabel =
    direction === 'en_or' ? 'English → Afaan Oromo' : 'Afaan Oromo → English'

  const wordCount = text.trim().split(/\s+/).length
  const estimatedHours = (wordCount / 1000).toFixed(2)

  const prompt = `You are a senior medical translation expert and public health researcher specializing in Afaan Oromo.

Translation direction: ${directionLabel}
Source type: ${sourceType}
Translator: ${translatorName}

CRITICAL RULES:
- Translate the ENTIRE document. Do NOT summarize, shorten, or skip sections.
- Preserve the original document structure, headings, and formatting.
- Maintain technical accuracy — this is for clinical and research use.
- If translating English → Afaan Oromo, use proper Afaan Oromo orthography and medical terminology where it exists.
- If a term has no direct Afaan Oromo equivalent, provide the English term in parentheses after your best translation.
- Explain all terminology decisions in the notes section.

Return your response in EXACTLY this format with these exact headers:

FULL TRANSLATION:
[Complete translated text here — every sentence, every paragraph]

TERMINOLOGY / TRANSLATION NOTES:
[List key medical terms you translated, decisions you made, any ambiguities, source → target mapping]

REVIEWER VERIFICATION NOTES:
[Notes for a clinician or researcher to verify accuracy. Call out any sections they should double-check, any uncertain translations, or places where meaning may vary.]

RESEARCH / CONTRIBUTION METADATA:
- Source Type: ${sourceType}
- Language Direction: ${directionLabel}
- Word Count: ${wordCount}
- Estimated Contribution Time: ${estimatedHours} hours
- Category: ${sourceType.toLowerCase().includes('research') || sourceType.toLowerCase().includes('abstract') ? 'Research' : sourceType.toLowerCase().includes('clinical') || sourceType.toLowerCase().includes('discharge') || sourceType.toLowerCase().includes('note') ? 'Clinical Translation' : 'Public Health Education'}
- Translator: ${translatorName}

Now translate the following document:

---
${text}
---`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0]?.text || ''
    const parsed = parseOutput(raw)

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('Translation error:', err)
    return res.status(500).json({ error: err.message || 'Translation service error' })
  }
}
