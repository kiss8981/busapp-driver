import io from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL as string, {
  transports: ["websocket"],
});

export default socket;
