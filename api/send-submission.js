export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Submission is already saved to Firestore in SubmitAudit.jsx
    // This endpoint can log/track the submission if needed
    const { title, author, university, timestamp } = req.body

    console.log('Submission received:', {
      title,
      author,
      university,
      timestamp
    })

    res.status(200).json({
      success: true,
      message: 'Submission logged'
    })
  } catch (error) {
    console.error('Error processing submission:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process submission'
    })
  }
}
