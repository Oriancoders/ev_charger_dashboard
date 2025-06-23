import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080/api";

  // Auth APIs (no token required)

  static async loginUser(user) {
    const response = await axios.post(`${this.BASE_URL}/auth/login`, user, {
      withCredentials: true, // ✅ allow browser to store cookies (like refresh token)
    });
    return response.data;
  }

  static async signupUser(user) {
    const response = await axios.post(`${this.BASE_URL}/auth/signup`, user);
    return response.data;
  }

  // Device Management APIs (token required)
  static async getDevices(deviceId, token) {
    console.log("before axios call");
    console.log(token);
    const response = await axios.get(`${this.BASE_URL}/devices/DEVICE123`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async updateDeviceStatus(deviceId, status, token) {
    const response = await axios.put(
      `${this.BASE_URL}/devices/${deviceId}?status=${status}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  // Session Management APIs (token required)
  static async getAllSessions(token) {
    const response = await axios.get(`${this.BASE_URL}/sessions/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}
