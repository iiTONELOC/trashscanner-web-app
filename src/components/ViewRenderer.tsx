import { WithAuth, Loading } from '../components';
import { useState, useEffect, Suspense } from 'react';
import { Home, SignUp, Login, Lists } from '../pages';
import { useNavLinkContext, useRouterContext } from '../providers';

/**
 * This Component checks the current route and the current path and renders
 * the appropriate component based on the current path
 */

export default function ViewRenderer(): JSX.Element {
    const routerContext = useRouterContext();
    const { navLinks } = useNavLinkContext();

    const { currentRoute, handleRouteChange } = routerContext;
    const [isMounted, setIsMounted] = useState(false);

    const currentPath = window.location.pathname;

    const validLinks = navLinks.map(link => link.href);


    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // When the current path changes, check if it is a valid route
    // If the route is valid then the currentRoute state is updated
    useEffect(() => {
        if (isMounted && currentRoute !== currentPath) {
            // check if currentPath is a valid route
            validLinks.find(link => link === currentPath) && handleRouteChange(currentPath);
        }
    }, [currentPath, isMounted, handleRouteChange, currentRoute, validLinks]);


    // Renders the appropriate component based on the currentRoute state
    if (currentRoute === '/signup') {
        return <SignUp />;
    } else if (currentRoute === '/login') {
        return <Login />;
    } else if (currentRoute === '/lists') {
        return (
            <WithAuth>
                <Suspense fallback={<Loading />}>
                    <Lists />
                </Suspense>
            </WithAuth>
        );
    } else {
        return <Home />;
    }
}
