"use client";

import axios from "axios";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	"https://viewit-be-production.up.railway.app/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			// AI and merchant routes always use merchant token
			const isMerchantAction =
				config.url?.includes("/ai/") ||
				config.url?.includes("/analytics") ||
				config.url?.includes("/products") ||
				config.url?.includes("/hotspots") ||
				config.url?.includes("/upload");

			// Buyer routes use shopper token (with merchant as fallback)
			const isBuyerAction =
				!isMerchantAction &&
				(config.url?.includes("/buyer/") ||
					(config.url?.includes("/store/") &&
						window.location.pathname.includes("/store")));

			const merchantToken = localStorage.getItem("viewit_token");
			const shopperToken = localStorage.getItem("viewit_shopper_token");

			const token = isBuyerAction
				? shopperToken || merchantToken
				: merchantToken;

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor to handle errors
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			if (typeof window !== "undefined") {
				// Only trigger nuclear wipe for merchant dashboard routes
				if (
					!window.location.pathname.includes("/store") &&
					!window.location.pathname.includes("/marketplace") &&
					!window.location.pathname.includes("/login")
				) {
					localStorage.removeItem("viewit_token");
					document.cookie =
						"viewit_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
					window.location.href = "/login";
				} else if (window.location.pathname.includes("/buyer")) {
					// Just clear shopper session if it's a buyer action
					localStorage.removeItem("viewit_shopper_token");
					localStorage.removeItem("viewit_shopper_user");
				}
			}
		}
		return Promise.reject(error);
	},
);

export default api;
