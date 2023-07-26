# FENA - THE TASK

## Introduction
FENA - THE TASK is a simple application built with React (frontend), NestJS (backend), Sockets(real time update), and redis (queue) for sending emails in bulk. 

## Prerequisites
Before running the application using Docker Compose, make sure you have the following installed on your system:

- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/

## Installation and Setup
1. Clone the GitHub repository:

2. Run the following command to run the application
 `docker compose up`

3. This will start the frontend, backend, and redis services.

4. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Redis (internal access): redis:6379

## Usage
1. Access the frontend application in your web browser at http://localhost:3000.
2. In the input box, enter the number of emails you want to send and click the "Send" button.
3. The application will trigger the email sending process, and you'll receive a job ID in the browser.
4. The backend will add the email sending job to the redis queue, and the redis consumer (worker) will start processing the jobs.
6. The frontend will receive real-time updates via WebSocket and display the job status as emails are sent.

## Cleanup
1. To stop and remove the Docker containers, use the following command:
    `docker compose down`
