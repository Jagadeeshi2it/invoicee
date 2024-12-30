import { NextResponse } from 'next/server'

const CLEARBIT_API_KEY = process.env.CLEARBIT_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
  }

  if (!CLEARBIT_API_KEY) {
    console.error('Clearbit API key is not configured')
    return NextResponse.json({ error: 'Clearbit API key is not configured. Please check your environment variables.' }, { status: 500 })
  }

  try {
    const response = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, {
      headers: {
        'Authorization': `Bearer ${CLEARBIT_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch company data from Clearbit')
    }

    const data = await response.json()

    return NextResponse.json({
      name: data.name,
      location: `${data.location}, ${data.geo.city}, ${data.geo.country}`,
      phone: data.phone,
      email: data.site.emailAddresses[0],
      logo: data.logo,
    })
  } catch (error) {
    console.error('Error fetching company data:', error)
    return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 })
  }
}

