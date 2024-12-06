const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000; // Use dynamic port for Render

// Store nicknames
const nicknames = new Set();

// Parse JSON bodies
app.use(bodyParser.json());

// Login endpoint
app.post('/login', (req, res) => {
    const { nickname } = req.body;

    if (nicknames.has(nickname)) {
        res.json({ success: false });
    } else {
        nicknames.add(nickname);
        res.json({ success: true });
    }
});

// Serve static files (login and chat pages)
app.use(express.static(__dirname + '/public'));

// Create HTTP server and integrate WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Attach WebSocket to the same server

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
