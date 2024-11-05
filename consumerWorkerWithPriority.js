// In this example worker, it is up until terminated manually (Ctrl+C)
// If auto terminating is wanted, simply add code to close the channel, the connection, and exit process

const amqp = require("amqplib")

// RabbitMQ connection
const RABBITMQ_URL = "amqp://localhost"
const QUEUE_NAME = "emailQueueWithPriority"


// Function to connect to RabbitMQ and consume messages
async function consumeQueue(workerName) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL)
        const channel = await connection.createChannel()
        await channel.assertQueue(QUEUE_NAME, { durable: true, maxPriority: 10})

        console.log(`${workerName} is waiting for messages in ${QUEUE_NAME}`) // Identify the worker

        channel.consume(QUEUE_NAME, (msg) => {
            if (msg != null) {
                const emailDetails = JSON.parse(msg.content.toString())     // .content used to access the msg data
                sendEmail(workerName, emailDetails)
                channel.ack(msg)    // VERY IMPORTANT: remove msg from the queue, if not, msg might be re-queued
            }
        })
    } catch (error) {
        console.error(`${workerName} encountered an error: `, error)
    }
}

// Simulating sending an email
function sendEmail(workerName, { to, subject, body }) {
    console.log(`[${workerName}] Sending email to: ${to}`)
    console.log(`[${workerName}] Subject: ${subject}`)
    console.log(`[${workerName}] Body: ${body}`)
    console.log(`[${workerName}] Email sent successfully\n`)
}


// Start 2 workers
// Note: RabbitMQ handles msg distribution between workers automatically
consumeQueue("Worker 1")
consumeQueue("Worker 2")