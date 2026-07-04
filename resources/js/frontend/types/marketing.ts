export type MarketingProduct = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  short_description?: string | null;
  price: string | number | null;
  discount_type: string | null;
  discount_value: string | number | null;
  image_url: string | null;
};

export type MarketingReview = {
  id: number;
  name: string;
  body: string;
  rating: number;
  image_url?: string | null;
};

export type MarketingVendor = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type ActionHubTab = 'order' | 'message' | 'appointment';
