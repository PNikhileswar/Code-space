# README.md

# Code Storage App

## Overview

The Code Storage App is a MERN (MongoDB, Express, React, Node.js) application that allows users to store and manage code snippets. It features user authentication with email verification and OTP functionality, enabling users to save their codes privately or publicly.

## Features

- User registration and login with email verification
- OTP verification for new users
- Public code storage accessible to all users
- Private code storage for authenticated users
- User-friendly interface for writing and editing code
- List view for saved codes

## Technologies Used

- **Frontend:** React, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT, Email verification, OTP

## Project Structure

```
code-storage-app
├── client
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── app.js
│   └── package.json
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client and server directories and install dependencies:
   ```
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Start the server:
   ```
   cd server
   node app.js
   ```

4. Start the client:
   ```
   cd client
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.