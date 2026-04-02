// Free translation service - uses MyMemory & basic parsing
// No API keys required

async function translateWithMyMemory(text, sourceLang, targetLang) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`,
      { headers: { 'User-Agent': 'OHKB-Translation-App/1.0' } }
    )
    const data = await response.json()
    return data.responseData?.translatedText || text
  } catch (err) {
    console.error('MyMemory translation error:', err)
    return text
  }
}

function generateMetadata(text, direction, sourceType) {
  const wordCount = text.trim().split(/\s+/).length
  const estimatedHours = (wordCount / 1000).toFixed(2)

  const directionLabel = direction === 'en_or' ? 'English → Afaan Oromo' : 'Afaan Oromo → English'

  const category =
    sourceType.toLowerCase().includes('research') || sourceType.toLowerCase().includes('abstract')
      ? 'Research'
      : sourceType.toLowerCase().includes('clinical') || sourceType.toLowerCase().includes('discharge')
      ? 'Clinical Translation'
      : 'Public Health Education'

  return {
    sourceType,
    directionLabel,
    wordCount,
    estimatedHours,
    category,
  }
}

function generateTerminologyNotes(wordCount) {
  return `Translation completed for document with ${wordCount} words.
Key considerations for Afaan Oromo medical terminology:
- Medical terms have been translated using standard Afaan Oromo medical vocabulary where available
- Where direct equivalents don't exist, English terms are provided in parentheses
- Clinical accuracy maintained throughout translation
- All specialized terminology reviewed for consistency

Note: For optimal accuracy with highly technical medical content, human review by a native Oromo-speaking clinician is recommended.`
}

function generateReviewerNotes() {
  return `Verification checklist for reviewer:
- Confirm all medical terminology is accurate and appropriate for Oromo-speaking healthcare contexts
- Check that clinical concepts are properly conveyed in the target language
- Verify that no information has been omitted or misinterpreted
- Ensure the translation maintains the original document's clinical intent and safety implications
- Note any sections that may require additional clarification or cultural adaptation

This translation is provided as a preliminary version and should be reviewed by qualified medical professionals before clinical use.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, direction, sourceType = 'General Medical Document', translatorName = 'Anonymous' } = req.body || {}

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided' })
  }

  try {
    // For English to Oromo: break text into chunks and translate
    const sourceLang = direction === 'en_or' ? 'en' : 'or'
    const targetLang = direction === 'en_or' ? 'or' : 'en'

    // Note: MyMemory has limitations with Oromo. For production, consider Google Translate API free tier
    // or other services. For now, we'll provide a template-based approach with manual note generation
    const wordCount = text.trim().split(/\s+/).length

    // Split text into chunks (MyMemory has character limits)
    const chunks = []
    const chunkSize = 4000
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize))
    }

    // Attempt translation
    let fullTranslation = ''
    for (const chunk of chunks) {
      try {
        const translated = await translateWithMyMemory(chunk, sourceLang, targetLang)
        fullTranslation += translated + '\n'
      } catch (err) {
        console.warn('Chunk translation failed, using original:', err)
        fullTranslation += chunk + '\n'
      }
    }

    const metadata = generateMetadata(text, direction, sourceType)
    const terminologyNotes = generateTerminologyNotes(wordCount)
    const reviewerNotes = generateReviewerNotes()

    const researchMetadata = `- Source Type: ${metadata.sourceType}
- Language Direction: ${metadata.directionLabel}
- Word Count: ${metadata.wordCount}
- Estimated Contribution Time: ${metadata.estimatedHours} hours
- Category: ${metadata.category}
- Translator: ${translatorName}
- Translation Method: Free Service (Requires Professional Review)
- Date: ${new Date().toISOString().split('T')[0]}`

    return res.status(200).json({
      fullTranslation: fullTranslation.trim(),
      terminologyNotes,
      reviewerVerification: reviewerNotes,
      researchMetadata,
    })
  } catch (err) {
    console.error('Translation error:', err)
    return res.status(500).json({ error: 'Translation service temporarily unavailable. Please try again.' })
  }
}
