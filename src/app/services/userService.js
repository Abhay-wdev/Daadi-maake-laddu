
// /services/userService.js
import { fetcher } from "./api";

export const getUserProfile = () => fetcher("/api/user");
export const updateUserProfile = (data) =>
  fetcher("/api/user", { method: "PUT", body: data });
