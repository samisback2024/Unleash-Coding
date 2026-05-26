import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-[#ef4444]" />
          </div>
          <h2 className="text-lg font-semibold text-[#f1f5f9] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[#64748b] max-w-sm mb-6">
            An unexpected error occurred in this section. Try refreshing, or
            contact support if the problem persists.
          </p>
          {this.state.message && (
            <p className="text-xs font-mono text-[#ef4444]/70 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg px-4 py-2 max-w-sm break-all mb-5">
              {this.state.message}
            </p>
          )}
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
