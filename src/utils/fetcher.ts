import axios from "axios";

export const fetcher = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});
