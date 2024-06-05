# Use a Node.js base image
FROM node:18.20-alpine3.19

# Install PM2 globally
RUN npm install pm2 -g

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory

COPY . .
# COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code

# Build the Vue.js application
RUN yarn build

# Expose the port your app runs on
EXPOSE 3000

# Run your Vue.js application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
