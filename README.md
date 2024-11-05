# Email Notification Service Using RabbitMQ

The purpose of this project is to demonstrate a simple message queue using RabbitMQ, as well as a variation using priority messaging. 

## Table of Contents
- [Email Notification Service Using RabbitMQ](#email-notification-service-using-rabbitmq)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Notes](#notes)

---

## Overview

The project is designed to showcase how to use RabbitMQ for asynchronous message queuing, ensuring reliable and scalable email notifications. The producer (API endpoint) sends messages (email details) to a RabbitMQ queue, and consumer workers retrieve and process these messages concurrently. Furthermore, the messages are persisted in the queue, ensuring that no messages are lost even if the server goes down.

## Technologies Used

- **Node.js**: JS runtime environment.
- **Express.js**: Web framework for building the RESTful API.
- **amqplib**: RabbitMQ client library for Node.js.
- **RabbitMQ**: Message broker used for queuing and processing messages.

## Project Structure
- `producer.js`: Code for the producer (an API to send email details to the RabbitMQ queue)
- `consumerWorker.js`: Code for the consumers (workers that get messages off the queue and process them; in this case, simulate sending an email)
- `producerWithPriority.js`: Code for the producer with priority messaging
- `consumerWorkersWithPriority.js`: Code for the consumers with priority messaging


## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. Download it from [Node.js](https://nodejs.org/).
- **RabbitMQ**: You need to have RabbitMQ running on your machine. This can be done by spinning up a new container with a RabbitMQ server locally using Docker. Refer to the [RabbitMQ Installation Guide](https://www.rabbitmq.com/download.html) for more setup instructions.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ernesto-B/Email-Notifs-RabbitMQ-Demo.git
   cd https://github.com/Ernesto-B/Email-Notifs-RabbitMQ-Demo.git
    ```
2. **Install Dependencies**
    ```bash
    npm install
    ```
3. **Start RabbitMQ**
- Using docker
    ```bash
    docker run -d --name <container-name> -p 5672:5672 -p 15672:15672 rabbitmq:management
    ```
    - `<container-name>`: Required.
    - `5672`: The default port for RabbitMQ message broker (used for sending and receiving messages).
    - `15672`: The default port for the RabbitMQ Management UI.
## Usage
1. **Make sure RabbitMQ is running**. See above.
2. **Start the producer**
    ```bash
    node producer.js
    ```
    or
    ```bash
    node producerWithPriority.js
    ```
3. **Start the workers**
    ```bash
    node consumerWorkers.js
    ```
    or 
    ```bash
    node consumerWorkersWithPriority.js
    ```
4. **Call the endpoint**
- If the `Thunder Client` extension is installed, open the `requests.rest` file and click on the `Send Request` button.
- Alternatively, use `Postman` or `Curl`.

## Notes
- **RabbitMQ Management Interface:** You can access the RabbitMQ dashboard at http://localhost:15672 (Default username: guest, password: guest).
- **Message Persistence:** The `{ durable: true }` option ensures the queue survives RabbitMQ server restarts.
- **Message Acknowledgment:** Using `channel.ack(msg)` ensures reliable message processing by removing the message from the queue.