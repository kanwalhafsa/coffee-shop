import FeedbackForm from "../../component/feedback-form"
import FeedbackList from "../../component/feedback-list"

export const metadata = {
  title: "Customer Feedback | Brew Haven",
  description: "Share your experience and read what others have to say about us",
}

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Customer Feedback</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We value your opinion. Share your experience with us and help us improve our service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h2 className="text-2xl font-semibold mb-6">Share Your Experience</h2>
            <FeedbackForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">What Our Customers Say</h2>
          <FeedbackList />
        </div>
      </div>
    </div>
  )
}
