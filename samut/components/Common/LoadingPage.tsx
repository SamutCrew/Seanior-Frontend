// LoadingPage.tsx

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

function LoadingPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render nothing or a placeholder while waiting for the client-side render
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary-500 bg-white dark:bg-black">
      <Spinner
        size="lg"
        color="secondary"
        labelColor="secondary"
      />
      <h1 className="mt-4 text-xl font-semibold">{("Loading...")}</h1>
      <p className="text-mute text-xs">{("Refresh the page if it takes too long")}</p>
    </div>
  );
}

export default LoadingPage;
