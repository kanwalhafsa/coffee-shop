"use client"

import { Suspense } from "react"

function NotFoundContent() {
  return <div>404 - Page Not Found</div>
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}