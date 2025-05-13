"use client"

import { toast } from "sonner"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const showToast = ({ title, description, variant }: ToastProps) => {
    if (variant === "destructive") {
      toast.error(title, {
        description: description,
      })
    } else {
      toast.success(title, {
        description: description,
      })
    }
  }

  return { toast: showToast }
}