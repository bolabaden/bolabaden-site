"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Scoped error boundary for page sections.
 * Catches React render errors inside a single section so the rest of the
 * page continues to render normally.
 */
export class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[SectionErrorBoundary] Render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 text-yellow-500/70" />
          <p className="text-sm font-medium">
            {this.props.fallbackTitle ?? "This section failed to load"}
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-sm text-center">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
