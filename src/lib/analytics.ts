
type EventName = 
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'sign_up'
  | 'login'
  | 'loyalty_redemption';

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
}

export function trackEvent({ name, properties = {} }: AnalyticsEvent) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, properties);
  }
  
  // Custom analytics endpoint
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: name,
        properties,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export function trackPageView(url: string) {
  trackEvent({
    name: 'page_view',
    properties: {
      page_path: url,
    },
  });
}

export function trackAddToCart(product: any, quantity: number) {
  trackEvent({
    name: 'add_to_cart',
    properties: {
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      price: product.price,
      quantity,
      value: product.price * quantity,
    },
  });
}

export function trackPurchase(orderId: string, total: number, items: any[]) {
  trackEvent({
    name: 'purchase',
    properties: {
      transaction_id: orderId,
      value: total,
      currency: 'USD',
      tax: items.reduce((sum, item) => sum + (item.tax || 0), 0),
      shipping: 0,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
}