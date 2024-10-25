# Use an official Node.js runtime as a parent image
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for frontend and backend
COPY FrontEnd/package.json ./FrontEnd/
COPY FrontEnd/package-lock.json ./FrontEnd/
COPY Server/package.json ./Server/
COPY Server/package-lock.json ./Server/


# Install dependencies for both the frontend and backend
RUN npm install --prefix FrontEnd
RUN npm install --prefix Server

# Copy the rest of the frontend and backend files
COPY FrontEnd ./FrontEnd
COPY Server ./Server

# Build the frontend (if applicable)
RUN npm run build --prefix FrontEnd

# Start command for your application (adjust as needed)
CMD ["node", "Server/index.js"]
