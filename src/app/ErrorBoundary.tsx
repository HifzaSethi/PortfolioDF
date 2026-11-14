import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Digital Field application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen df-mesh-dark flex items-center justify-center px-6 py-16">
          <div className="max-w-lg df-glass-dark p-8 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
              Digital Field.
            </p>
            <h1 className="text-3xl font-extrabold text-[var(--off-white)]">
              Something interrupted this view.
            </h1>
            <p className="text-sm leading-relaxed text-[var(--on-dark-muted)]">
              An unexpected rendering error occurred. Reloading the page or returning to the home
              route should restore the view.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="on-dark" onClick={() => window.location.reload()}>
                Reload page
              </Button>
              <a
                href="#/"
                className="inline-flex min-h-[44px] items-center px-5 py-2.5 text-sm font-semibold text-[var(--off-white)] border border-[var(--border-dark-strong)] hover:border-[var(--electric-blue)]"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
