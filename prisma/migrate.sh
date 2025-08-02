#!/bin/bash

# Apply database migrations
npx prisma migrate dev --name init

# Start the application
npm run dev