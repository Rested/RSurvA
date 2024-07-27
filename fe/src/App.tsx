import { lazy, LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';
import Home from './routes/Home';
import HowItWorks from './routes/HowItWorks';
// Asynchronous imports using lazy
const Survey = lazy(() => import('./routes/Survey'));
const NotFound = lazy(() => import('./routes/NotFound'));

export function App() {
    return (
        <LocationProvider>
            <ErrorBoundary>
                <Router>
                    <Home path="/" />
                    <Route path="/survey/:surveyId" component={Survey} />
                    <HowItWorks path="/how-it-works" />
                    <NotFound default />
                </Router>
            </ErrorBoundary>
        </LocationProvider>
    );
}

export default App;
