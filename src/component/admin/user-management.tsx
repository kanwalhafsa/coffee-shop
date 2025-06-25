"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  provider: string
  created_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        })
        fetchUsers()
      } else {
        throw new Error("Failed to update user role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">User Management</h3>

      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{user.name}</h4>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateUserRole(user.id, user.role === "admin" ? "user" : "admin")}
                >
                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
