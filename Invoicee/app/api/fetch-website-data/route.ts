import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    // Here you would implement the logic to scrape the website
    // For demonstration, we're returning mock data
    const mockData = {
      name: 'Example Company',
      address: '123 Example St, Example City, EX 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@example.com',
    }

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching website data:', error)
    return NextResponse.json({ error: 'Failed to fetch website data' }, { status: 500 })
  }
}

