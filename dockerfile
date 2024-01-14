# Specify the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the app dependencies (inside the container)
RUN npm install

# Bundle the app source by copying it to the working directory
COPY . .

# Your app binds to port 5000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5000

# Define the command to run the app
CMD [ "npm", "start" ]