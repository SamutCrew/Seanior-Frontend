// Create a HOC to handle different layout types
import type React from "react"
import type { LayoutType } from "@/types/layout"

const withLayout = (Component: React.ComponentType<any>, layoutType: LayoutType) => {
  // Return a new component that wraps the original component
  const WithLayoutComponent = (props: any) => {
    // Add a data attribute to the component to identify the layout type
    return <Component {...props} data-layout={layoutType} />
  }

  // Set the display name for better debugging
  WithLayoutComponent.displayName = `withLayout(${Component.displayName || Component.name || "Component"})`

  return WithLayoutComponent
}

export default withLayout
