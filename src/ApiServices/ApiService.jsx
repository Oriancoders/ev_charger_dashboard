import axios from "axios";
export default class ApiService {
  
    static BASE_URL = "http://localhost:8080/api";

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    }

    static async registerUser(user) {
        const response = await axios.post(
            `${this.BASE_URL}/auth/signup`,user)
        return response.data;
    }

    static async loginUser(user) {
    const response = await axios.post(
        `${this.BASE_URL}/auth/login`,
        user,
        {
            withCredentials: true // ✅ allow browser to store cookies (like refresh token)
        }
    );
    return response.data;  
    }

    static async signupUser(user) {
        const response = await axios.post(
            `${this.BASE_URL}/auth/signup`, user)
        return response.data;
    }


}
