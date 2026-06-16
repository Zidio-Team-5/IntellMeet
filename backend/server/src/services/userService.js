import { User } from "../models/User.js";
import { publicUser } from "./authService.js";

export const listUsers = async () => (await User.find({})).map(publicUser);
export const getUserById = async (id) => {
  const u = await User.findById(id);
  if (!u) { const e = new Error("User not found."); e.status = 404; throw e; }
  return publicUser(u);
};
