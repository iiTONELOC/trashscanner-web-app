import { WithAuth, Loading } from '../components';
import { useState, useEffect, Suspense } from 'react';
import { Home, SignUp, Login, List, Lists } from '../pages';
import { useNavLinkContext, useRouterContext } from '../providers';


function ComponentLoader(props:
    {
        currentRoute: string,
        currentPath: string,
        regex: RegExp
    }
): JSX.Element {
    if (props.currentRoute === '/signup') {
        return <SignUp />;
    } else if (props.currentRoute === '/login') {
        return <Login />;
    } else if (props.currentRoute === '/lists') {
        return (
            <WithAuth>
                <Suspense fallback={<Loading />}>
                    <Lists />
                </Suspense>
            </WithAuth>
        );
    } else if (props.regex.test(props.currentPath)) {
        return (
            <WithAuth>
                <Suspense fallback={<Loading />}>
                    <List />
                </Suspense>
            </WithAuth>
        );
    } else {
        return <Home />;
    }
}

/**
 * This Component checks the current route and the current path and renders
 * the appropriate component based on the current path
 */

export default function ViewRenderer(): JSX.Element { // NOSONAR
    const currentPath = window.location.pathname;
    const routerContext = useRouterContext();
    const { navLinks } = useNavLinkContext();

    const { currentRoute, handleRouteChange } = routerContext;
    const [isMounted, setIsMounted] = useState(false);

    const validLinks = navLinks.map(link => link.href);
    const listRegex = /^\/list\/[a-z0-9]{24}$/;

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // When the current path changes, check if it is a valid route
    // If the route is valid then the currentRoute state is updated
    useEffect(() => {
        if (isMounted && currentRoute !== currentPath) {
            // check if currentPath is a valid route
            validLinks.find(link => link === currentPath
                || listRegex.test(currentPath)) && handleRouteChange(currentPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath, isMounted, handleRouteChange, currentRoute, validLinks]);


    return (
        <ComponentLoader
            currentRoute={currentRoute}
            currentPath={currentPath}
            regex={listRegex} />
    );
}
