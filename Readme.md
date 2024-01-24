# Online Food Delivery App - [Backend](https://online-food-delivery-59o2.onrender.com)

This repository contains the backend code for an online food delivery application built using Express, TypeScript, MongoDB, and Razorpay.

## Features

- **Express Framework:** Utilizes the popular Express framework for building robust and scalable APIs.

- **TypeScript:** Written in TypeScript to enhance code quality, maintainability, and developer productivity.

- **MongoDB Database:** Integrates MongoDB for efficient storage and retrieval of restaurant details, menus, user profiles, and order history.

- **Razorpay Integration:** Seamless integration with Razorpay for secure and efficient online payment processing.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB instance set up.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/food-delivery-backend.git
   cd food-delivery-backend
2. Install the node_modules
    ```
    npm i
    ```
3. populate a .env with values
    ```
    MongoUri = database uri
    App_Secret = some app secret 32 byte
    AccountSid = twilio account sid
    AuthToken = twilio auth token
    PhoneNumber = twilio phone number
    VERIFYSID = twilio verify sid
    ```
4.  Start the development server
    ```
    npm run dev
    ```
5.  Build the distributable package
    ```
    npm run build
    ```

    &copy; Shiv Shankar Kushwaha