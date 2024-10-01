# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy the rest of your application's source code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3200

# Command to run the Node.js application
CMD ["npm", "start"]
