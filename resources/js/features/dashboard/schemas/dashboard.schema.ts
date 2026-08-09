export type DashboardRecentOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export type DashboardStats = {
  orders: {
    total: number;
    pending: number;
    revenue: number;
    total_sales: number;
    due: number;
  };
  reviews: {
    total: number;
    average_rating: number;
    pending_visibility: number;
  };
  customers: {
    total: number;
  };
  products: {
    total: number;
    active: number;
  };
  contacts: {
    total: number;
    unread: number;
  };
  recent_orders: DashboardRecentOrder[];
};
