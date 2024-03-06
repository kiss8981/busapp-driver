import io from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL as string, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 4000,
});

export default socket;
