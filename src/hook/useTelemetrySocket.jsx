import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useTelemetrySocket = (deviceId, token) => {
  const [telemetry, setTelemetry] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!deviceId || !token) return;

    const socket = new SockJS(`https://evbackend-gayt.onrender.com/ws?token=${encodeURIComponent(token)}`);
    // const socket = new SockJS(`https://localhost:8080/ws?token=${encodeURIComponent(token)}`);



    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log("📘 STOMP debug:", str);
      },
      onConnect: () => {
        console.log("✅ WebSocket connected");

        client.subscribe(`/topic/telemetry/${deviceId}`, (message) => {
          try {
            console.log("🧾 Raw message body:", message.body);
            const data = JSON.parse(message.body);
            setTelemetry(data);
          } catch (err) {
            console.error("❌ Failed to parse telemetry:", err);
          }
        });
      },
      onWebSocketError: (error) => {
        console.error("🛑 WebSocket error:", error);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [deviceId, token]);

  return telemetry;
};

export default useTelemetrySocket;
