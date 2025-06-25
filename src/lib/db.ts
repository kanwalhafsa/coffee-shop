import { createClient } from "@supabase/supabase-js"

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"

// Only create client if we have valid credentials
let supabase: any = null
let supabaseClient: any = null

try {
  if (supabaseUrl !== "https://placeholder.supabase.co" && supabaseKey !== "placeholder-key") {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Client-side Supabase client (for browser usage)
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  } else {
    console.warn("Supabase credentials not configured, using mock client")

    // Mock client for development
    supabase = {
      from: () => ({
        select: () => ({ single: () => ({ data: null, error: new Error("Supabase not configured") }) }),
        insert: () => ({
          select: () => ({ single: () => ({ data: null, error: new Error("Supabase not configured") }) }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({ single: () => ({ data: null, error: new Error("Supabase not configured") }) }),
          }),
        }),
      }),
    }

    supabaseClient = supabase
  }
} catch (error) {
  console.error("Supabase initialization error:", error)

  // Fallback mock client
  supabase = {
    from: () => ({
      select: () => ({ single: () => ({ data: null, error: new Error("Supabase connection failed") }) }),
      insert: () => ({
        select: () => ({ single: () => ({ data: null, error: new Error("Supabase connection failed") }) }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({ single: () => ({ data: null, error: new Error("Supabase connection failed") }) }),
        }),
      }),
    }),
  }

  supabaseClient = supabase
}

export { supabase, supabaseClient }
