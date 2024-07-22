# CountryAPI

## Overview

CountryAPI is a comprehensive API that provides detailed information about any country in the world. The API offers various services, each with its own authentication requirements (No Auth/ Basic Auth / API Key / Bearer Token), ensuring secure access to the data.

## Features

- Retrieve detailed information about any country.
- Different services for various types of country data.
- Each service has its own authentication requirements for enhanced security.
- API Documentation: https://documenter.getpostman.com/view/36645222/2sA3kUGhjm

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Setup and Installation

### Prerequisites

- Node.js
- MongoDB
- nodemon

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BassemArfaoui/CountriesAPI-with-MongoDB.git
   cd CountriesAPI-with-MongoDB
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the MongoDB database:

   - Install MongoDB and start the MongoDB server.
   - Create a new MongoDB database.
   - Import the data from the provided CSV file into the MongoDB database. You can use the `mongoimport` tool to do this:

     ```bash
     mongoimport --db your-database-name --collection countries --type csv --headerline --file path/to/your/csvfile.csv
     ```



4. Run the application:

   ```bash
   node index.js
   ```

   Alternatively, you can use:

   ```bash
   nodemon index.js
   ```

   Or:

   ```bash
   npm run dev
   ```

## Documentation

For detailed documentation of the API, please refer to the [Postman Documentation](https://documenter.getpostman.com/view/36645222/2sA3kUGhjm).
