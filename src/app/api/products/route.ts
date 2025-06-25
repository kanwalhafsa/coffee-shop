// src/app/api/products/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  let query = supabase.from('products').select('*')
  
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}