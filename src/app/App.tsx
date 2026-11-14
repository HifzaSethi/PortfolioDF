import { MotionConfig } from 'motion/react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '../hooks/useTheme';
import { ErrorBoundary } from './ErrorBoundary';
import { Layout } from './Layout';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <HashRouter>
            <Layout>
              <AppRoutes />
            </Layout>
          </HashRouter>
        </MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
