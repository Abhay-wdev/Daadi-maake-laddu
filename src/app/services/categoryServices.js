// /services/orderService.js
import { fetcher } from "./api";

export const getOrders = () => fetcher("/api/orders");
export const createOrder = (data) =>
  fetcher("/api/orders", { method: "POST", body: data });
