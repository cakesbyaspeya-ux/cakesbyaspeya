import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { lat, lng } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Google Maps API key is missing from .env.local' }, { status: 500 });
    }

    // Call Google's Geocoding API
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=en`
    );
    
    const data = await res.json();

    // Catch Google API specific errors (like billing disabled)
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return NextResponse.json({ 
        error: `Google API Error: ${data.status} - ${data.error_message || 'Unknown error'}` 
      }, { status: 400 });
    }

    // Extract the human-readable address
    const address = data.results[0].formatted_address;
    return NextResponse.json({ address });

  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}