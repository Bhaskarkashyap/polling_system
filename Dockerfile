# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependencies first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
