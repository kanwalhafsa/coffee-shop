import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user (production mein password ko bcrypt se hash karein)
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password, // Production mein hash karna zaroori hai
        provider: "credentials",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
