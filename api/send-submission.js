export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, author, university, wordCount, estimatedHours, sourceType, direction, contributionType, timestamp } = req.body

    // Log submission for now (in production, integrate with email service)
    console.log('Submission received:', {
      title,
      author,
      university,
      wordCount,
      estimatedHours,
      sourceType,
      direction,
      contributionType,
      timestamp
    })

    // TODO: Send email to aimonibssa@gmail.com using Resend, SendGrid, or similar
    // For now, just acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Submission logged. Email notification pending.'
    })
  } catch (error) {
    console.error('Error processing submission:', error)
    res.status(500).json({ error: 'Failed to process submission' })
  }
}
