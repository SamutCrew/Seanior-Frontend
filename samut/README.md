This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📝 Description

This frontend application serves as the user interface for the 'Online Platform for Connecting Learners with Swimming Coaches.' It enables learners to easily search for and connect with swimming coaches, and for coaches to manage their profiles and course offerings. By interacting with the dedicated backend API, this Next.js application aims to solve the problems of difficult searching and the unreliability of existing online channels, providing a convenient and user-friendly experience for both parties.

## 🚀 Features

- **Responsive UI**: Fully responsive design for all devices
- **User Authentication**: Login/signup for students and instructors
- **Course Management**: View and enroll in swimming courses
- **Dashboard**: Personalized dashboards for different user roles
- **Attendance Tracking**: View attendance records
- **Payment Integration**: Secure payment processing via Stripe
- **Real-time Notifications**: Get updates on course changes and payments
- **Profile Management**: Update personal information and preferences

## 🛠 Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Backend API (Seanior Backend)
- Firebase configuration (for authentication)
- Stripe publishable key (for payment processing)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/seanior-frontend.git
   cd seanior-frontend

2. **Install dependencies**
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


## Frontend Environment Variables

## Backend API Configuration
NEXT_PUBLIC_API_URL="https://your-backend-api.com/api/v1"

##  Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abc123def456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABC123DEF4"


##  Firebase Admin (Server-side only)
FIREBASE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@your-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40your-project.iam.gserviceaccount.com"
}'


##  Payment Gateway (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key_here"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_here"  # Server-side only
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"   # Server-side only

## Google Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
