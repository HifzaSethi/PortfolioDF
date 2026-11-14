import { HashRouter } from 'react-router-dom';
// PRODUCTION DEPLOYMENT NOTE:
// For clean URLs without '#', swap HashRouter for BrowserRouter below and ensure server rewrites route all requests to /index.html.
// import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Layout } from './Layout';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </HashRouter>
    </ErrorBoundary>
  );
}
