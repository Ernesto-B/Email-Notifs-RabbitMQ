const express = require("express");
const amqp = require("amqplib");
const app = express();
app.use(express.json());

// RabbitMQ connection
const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "emailQueueWithPriority";

// Connect to RabbitMQ and send a message with priority
async function sendToQueue(emailDetails, priority = 0) {  // Default priority is 0
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Specify the queue with maximum priority level
        await channel.assertQueue(QUEUE_NAME, { durable: true, maxPriority: 10 });  // maxPriority defines the highest priority level

        // Send the message with priority
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(emailDetails)), { priority });

        console.log(`Message sent to queue: ${JSON.stringify(emailDetails)} with priority: ${priority}\n`);

        // await channel.close();
        // await connection.close();
    } catch (error) {
        console.error("Error sending message to RabbitMQ: ", error);
    }
}

// API endpoint to send messages
app.post("/send-email", async (req, res) => {
    const { to, subject, body, priority } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).send("Missing email details...\n");
    }

    const emailDetails = { to, subject, body };

    // Call sendToQueue with the specified priority
    await sendToQueue(emailDetails, priority || 0);
    res.status(200).send("Email details sent to queue...\n");
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
