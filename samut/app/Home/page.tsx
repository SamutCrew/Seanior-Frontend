export default function LandingPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="text-center max-w-3xl px-4">
          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to <span className="text-blue-600">Your App</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            A seamless way to manage your tasks, collaborate, and boost productivity.
          </p>
          <div className="mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700">
              Get Started
            </button>
            <button className="ml-4 px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-600">
              Learn More
            </button>
          </div>
        </section>
  
        {/* Features Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <FeatureCard
            title="Fast & Efficient"
            description="Experience a smooth, optimized workflow for all your tasks."
          />
          <FeatureCard
            title="Secure & Reliable"
            description="Your data is protected with the latest security measures."
          />
          <FeatureCard
            title="Easy to Use"
            description="An intuitive interface designed for productivity and ease."
          />
        </section>
  
        {/* Footer */}
        <footer className="mt-16 text-gray-600 dark:text-gray-400 text-sm">
          © 2024 Your Company. All rights reserved.
        </footer>
      </div>
    );
  }
  
  type FeatureCardProps = {
    title: string;
    description: string;
  };
  
  function FeatureCard({ title, description }: FeatureCardProps) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    );
  }
  
  