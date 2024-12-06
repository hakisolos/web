const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const port = 3000;

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

// WebSocket server
const wss = new WebSocket.Server({ port: 3001 });

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

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});