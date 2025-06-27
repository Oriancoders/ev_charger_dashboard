import axios from "axios";

export default class ApiService {
  static BASE_URL = "https://evbackend-gayt.onrender.com/api";
  // static BASE_URL = "http://localhost:8080/api";

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

  static async getUserSessions(token) {
    const response = await axios.get(`${this.BASE_URL}/sessions/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async accessTokenFromRefreshToken() {
    const response = await axios.post(
      `${this.BASE_URL}/auth/refresh`,
      {},
      {
        withCredentials: true, // ✅ This sends the HTTP-only cookie
      }
    );
    return response.data;
  }

  static async logout() {
    const response = await axios.post(
      `${this.BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true, // ✅ This sends the HTTP-only cookie
      }
    );
    return response.data;
  }

  //api for starting a new session
  static async startSession(token) {
    const response = await axios.post(
      `${this.BASE_URL}/sessions/start?deviceId=DEVICE123`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async stopSession(token) {
    const response = await axios.post(
      `${this.BASE_URL}/sessions/stop?deviceId=DEVICE123`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async isCurrentlyCharging(token) {
    const response = await axios.get(`${this.BASE_URL}/sessions/isInUse?deviceId=DEVICE123`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async isInService(token) {
    const response = await axios.get(`${this.BASE_URL}/sessions/isInService?deviceId=DEVICE123`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async setDeviceStatus(token , status) {
    const response = await axios.post(
       `${this.BASE_URL}/sessions/setDeviceAvailability?deviceId=DEVICE123&available=${status}`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }



}
