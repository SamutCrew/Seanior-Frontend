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
   ```bash
   npm install
   ```
## 🏃‍♂️ Running the App

```bash
# Development mode with watch
$ npm run dev

# Production build
$ npm run build
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
NEXT_PUBLIC_API_URL="https://your-backend-api.com/api/v1"

##  Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abc123def456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABC123DEF4"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key_here"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_here"  # Server-side only
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"   # Server-side only
```

## 🙏 Acknowledgments

- [NEXT.JS](https://nextjs.org/)
- [Stripe](https://stripe.com/)
- [Firebase](https://firebase.google.com/)

