# Use the official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies (don’t run npm ci if you don’t use a lockfile)
RUN npm install --production

# Copy the rest of your app’s source code
COPY . .

# Expose whatever port your app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
