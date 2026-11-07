'use client';
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 bg-red-950/80 border border-red-500/40 rounded-xl text-center text-red-200 text-xs font-mono my-2">
          <p className="font-bold uppercase tracking-wider mb-1">Notice</p>
          <p>{this.state.error?.message || 'A temporary visual error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-[11px] cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
