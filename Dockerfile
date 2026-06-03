FROM node:22-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package and package-lock files
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# ---

FROM node:22-alpine AS production

# Set node environment to production
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the build artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Set the port environment variable
ENV PORT=3000
EXPOSE $PORT

# Start the server
CMD ["node", "dist/main.js"]
