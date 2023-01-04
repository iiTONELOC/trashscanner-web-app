import { navLinks } from '../components';
import { useState, useEffect } from 'react';
import { Home, SignUp, Login } from '../pages';
import { useRouterContext } from '../providers';

/**
 * This Component checks the current route and the current path and renders
 * the appropriate component based on the current path
 */

export default function ViewRenderer(): JSX.Element {
    const routerContext = useRouterContext();
    const { currentRoute, handleRouteChange } = routerContext;
    const [isMounted, setIsMounted] = useState(false);

    const currentPath = window.location.pathname;

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // When the current path changes, check if it is a valid route
    // If the route is valid then the currentRoute state is updated
    useEffect(() => {
        if (isMounted && currentRoute !== currentPath) {
            // check if currentPath is a valid route
            navLinks.find(link => link.href === currentPath) && handleRouteChange(currentPath);
        }
    }, [currentPath, isMounted, handleRouteChange, currentRoute]);


    // Renders the appropriate component based on the currentRoute state
    if (currentRoute === '/signup') {
        return <SignUp />;
    } else if (currentRoute === '/login') {
        return <Login />;
    } else {
        return <Home />;
    }
}