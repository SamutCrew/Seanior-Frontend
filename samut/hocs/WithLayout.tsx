// app/hocs/WithLayout.tsx
import React from "react";
import DashboardWrapper from "@/app/dashboardWrapper";
import { LayoutType } from "@/app/types/layout";

interface WithLayoutOptions {
  showHeader?: boolean;
}

const withLayout = (
  Component: React.ComponentType<any>,
  layoutType: LayoutType,
  options: WithLayoutOptions = {}
) => {
  const WrappedComponent = (props: any) => {
    //layoutType is None, render without wrapper
    if (layoutType === LayoutType.None) {
      return <Component {...props} />;
    }

    // Pass layoutType to DashboardWrapper
    return (
      <DashboardWrapper layoutType={layoutType}>
        <Component {...props} />
      </DashboardWrapper>
    );
  };

  // Set display name for debugging
  WrappedComponent.displayName = `WithLayout(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};

export default withLayout;