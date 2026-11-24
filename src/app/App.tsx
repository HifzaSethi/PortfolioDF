import { MotionConfig } from 'motion/react';
import { HashRouter } from 'react-router-dom';
import { IntroProvider, useIntro } from '../components/intro/IntroContext';
import { IntroGate } from '../components/intro/IntroGate';
import { ContentProvider } from '../context/ContentContext';
import { ThemeProvider } from '../hooks/useTheme';
import { ErrorBoundary } from './ErrorBoundary';
import { Layout } from './Layout';
import { AppRoutes } from './routes';

function AppShell() {
  const { isActive } = useIntro();

  return (
    <>
      <div id="app-shell" inert={isActive ? true : undefined}>
        <Layout>
          <AppRoutes />
        </Layout>
      </div>
      <IntroGate />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <ContentProvider>
            <IntroProvider>
              <HashRouter>
                <AppShell />
              </HashRouter>
            </IntroProvider>
          </ContentProvider>
        </MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

