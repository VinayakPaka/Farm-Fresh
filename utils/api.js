import AsyncStorage from '@react-native-async-storage/async-storage';
import asyncStorage from '@react-native-async-storage/async-storage';



import { Platform } from 'react-native';

// Dynamically set API URL based on platform
// For web: use localhost
// For mobile: use your computer's local IP address
const getApiBaseUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:3000';
    } else {
        // Your computer's current IP address (found via ipconfig)
        // Make sure your mobile device is on the same WiFi network
        return 'http://10.51.4.196:3000';
    }
};

const API_BASE_URL = getApiBaseUrl();

export const getToken = () => {

};

export const saveToken = async(token) => {
    try {
        await AsyncStorage.setItem('authToken', token)
        return token
    } catch (error) {
        console.error("Token cannot be Saved");
        return null
    }
}; 

const apiRequest = async (endpoint,
    method = "GET",
    body = null,
    requiresAuth = false
) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json"
        }

        const config = {
            method,
            headers
        }

       

        if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
            config.body = JSON.stringify(body);
        }

        

        console.log('API Request:', method, url);
        if (body) {
            console.log('Request Body:', body);
        }

        const response = await fetch(url, config)
        const data = await response.json()

        console.log('Response Status:', response.status);
        console.log('Response Data:', data);

        if (!response.ok) {
            // Throw error with the server's message
            const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}

export const authApi = {
    signup: async (name, email, password) => {
        return apiRequest('/api/auth/signup', "POST", {name, email, password})
    },

    login: async (email, password) => {
        return apiRequest('/api/auth/login', "POST", {email, password})
    },
};

// Products API
export const productsApi = {
    // Get all products with optional filters
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.q) queryParams.append('q', filters.q);
        if (filters.category) queryParams.append('category', filters.category);
        const queryString = queryParams.toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
        return apiRequest(endpoint, "GET");
    },

    // Get a single product by ID
    getById: async (id) => {
        return apiRequest(`/products/${id}`, "GET");
    },

    // Create a new product
    create: async (productData) => {
        return apiRequest('/products', "POST", productData);
    },
};
