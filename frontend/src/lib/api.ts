import axios from "axios";
import { useAuthStore } from "../store/auth.store.ts";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach the owner's JWT to every request, if logged in.
// Customer-facing calls (shop lookup, upload, order creation) never need this - they're public - the header is simply absent for those.
api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
