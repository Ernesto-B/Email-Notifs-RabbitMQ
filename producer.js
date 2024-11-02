const express = require("express")
const amqp = require("amqplib")
const app = express()
app.use(express.json())

// RabbitMQ connection
const RABBITMQ_URL = "amqp://localhost"
const QUEUE_NAME = "emailQueue"

// Connect to RabbitMQ and send a message 
async function sendToQueue(emailDetails) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL)
        const channel = await connection.createChannel()    // Channel is used to communicate with RabbitMQ server
        // Specify the queue you want the channel to connect to. (will make it if not made)
        // The { durable: true } option makes the queue survive a RabbitMQ server restart.
        await channel.assertQueue(QUEUE_NAME, { durable: true })
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(emailDetails)))  // RabbitMQ works with binary data, such as a buffer
        console.log(`Message sent to queue: ${JSON.stringify(emailDetails)}...\n`)
        await channel.close()
        await connection.close()
    } catch (error) {
        console.error("Error sending message to RabbitMQ: ", error)
    }
}


// API endpoint to send messages, cb must be async since calling an async function
app.post("/send-email", async (req, res) => {
    const { to, subject, body } = req.body
    if (!to || !subject || !body) {
        res.status(400).send("Missing email details...\n")
    }

    const emailDetails = { to, subject, body }

    await sendToQueue(emailDetails)
    res.status(200).send("Email details sent to queue...\n")
})


const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})