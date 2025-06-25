import type { NextAuthOptions, User, Account, Profile } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/db"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider - only add if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Supabase se user check karein with role
          const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

          if (error || !user) {
            return null
          }

          // Password verify karein (production mein bcrypt use karein)
          if (user.password === credentials.password) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role || "user", // Default role 'user'
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User
      account: Account | null
      profile?: Profile
    }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const { data: existingUser } = await supabase.from("users").select("*").eq("email", user.email).single()

          if (existingUser) {
            // Update user info and get role
            const { data: updatedUser } = await supabase
              .from("users")
              .update({
                name: user.name,
                provider: "google",
                provider_id: user.id,
              })
              .eq("email", user.email)
              .select()
              .single()

            if (updatedUser) {
              user.role = updatedUser.role || "user"
            }
          } else {
            // Create new user with default role
            const { data: newUser, error } = await supabase
              .from("users")
              .insert({
                email: user.email,
                name: user.name,
                provider: "google",
                provider_id: user.id,
                role: "user", // Default role
              })
              .select()
              .single()

            if (error) {
              console.error("Database error:", error)
              return false
            }

            if (newUser) {
              user.role = newUser.role
            }
          }
        } catch (error) {
          console.error("Sign in error:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
