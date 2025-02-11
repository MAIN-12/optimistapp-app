/* eslint-disable no-console */

/**
 * @swagger
 * /api/support/feedback:
 *   post:
 *     tags:
 *       - Support & Feedback
 *     summary: Submit user feedback
 *     description: Creates a new feedback entry in Monday.com with user details, feedback type, and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the feedback
 *                 example: "Issue with Dashboard"
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the user
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Email of the user
 *                     example: "johndoe@example.com"
 *               description:
 *                 type: string
 *                 description: Detailed feedback description
 *                 example: "The dashboard takes too long to load when filtering results."
 *               location:
 *                 type: string
 *                 description: The page or section where the issue was encountered
 *                 example: "Dashboard > Reports"
 *               type:
 *                 type: string
 *                 description: The type of feedback (e.g., bug, suggestion, other)
 *                 example: "bug"
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: string
 *                   description: The ID of the created feedback item
 *                   example: "12345"
 *       500:
 *         description: Error submitting feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to submit feedback"
 */


import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const apiKey = process.env.MONDAY_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 })
  }

  const { title, user, description, location, type } = await request.json()

  const boardId = process.env.MONDAY_FEEDBACK_BOARD
  const url = 'https://api.monday.com/v2'

  const today = new Date().toISOString().split('T')
  const date = today[0]
  const time = today[1].split('.')[0]

  const query = `mutation {
    create_item (
      board_id: ${boardId},
      item_name: "${title}",
      column_values: "{
        \\"email\\": {
          \\"text\\" : \\"${user?.name || ''}\\", 
          \\"email\\" : \\"${user?.email || ''}\\"},
        \\"date_mkm2gphh\\": {
          \\"date\\" : \\"${date}\\", 
          \\"time\\" : \\"${time}\\"},
        \\"text\\":\\"${location}\\",
        \\"type_mkmwdrkv\\":\\"${type}\\",
        \\"long_text\\":\\"${description}\\"
      }"
    ) {id}}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
      },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()

    if (result.errors) {
      console.error(JSON.stringify(result, null, 2))
      return NextResponse.json({ error: 'Error submitting feedback to Monday.com' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.data.create_item.id })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
