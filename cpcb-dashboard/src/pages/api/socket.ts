import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

// Global variable to track interval across hot reloads in dev
let interval: NodeJS.Timeout | null = null;

const SocketHandler = (req: NextApiRequest, res: NextApiResponse | any) => {
    if (res.socket.server.io) {
        // Already running
        res.end();
        return;
    }

    console.log("Initializing Socket.io server...");
    const io = new Server(res.socket.server, {
        path: "/api/socket",
        addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
    });

    // Clear existing interval if any (for dev hot reload safety)
    if (interval) clearInterval(interval);

    // Simulate Industrial Data Stream
    interval = setInterval(() => {
        const factories = ['A', 'B', 'C'];
        const payload = factories.map(f => ({
            factory: f,
            timestamp: new Date().toISOString(),
            // Simulation logic:
            // Factory A: High Turbidity often
            // Factory B: Acidic pH often
            // Factory C: Mostly Normal
            turbidity: f === 'A' ? 180 + Math.random() * 50 : 100 + Math.random() * 50, // >200 is violation
            ph: f === 'B' ? 6.0 + Math.random() * 1.5 : 6.8 + Math.random() * 1.0,      // <6.5 is violation
            conductivity: 1200 + Math.random() * 300,
        }));

        io.emit("sensor-data", payload);
    }, 5000);

    res.end();
};

export default SocketHandler;
