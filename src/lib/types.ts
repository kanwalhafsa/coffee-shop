export interface Coffee {
    id: string
    name: string
    description: string
    price: number
    image: string
    width: number
    height: number
    category: string
    featured?: boolean
  }
  
  export interface CartItem extends Coffee {
    quantity: number
  }
  
  export interface Feedback {
    id: number
    name: string
    rating: number
    comment: string
    date: string
  }
  