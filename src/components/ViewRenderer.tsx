import { WithAuth, Loading } from '../components';
import { useState, useEffect, Suspense } from 'react';
import { Home, SignUp, Login, List, Lists } from '../pages';
import { IRouterContextType, useRouterContext, useUserContext } from '../providers';

function ComponentLoader(props:
    {
        currentRoute: string,
        currentPath: string,
        regex: RegExp
    }
): JSX.Element {
    const { isAuthenticated } = useUserContext();
    if (props.currentRoute === '/signup') {
        return <SignUp />;
    } else if (props.currentRoute === '/login') {
        return <Login />;
    } else if (props.currentRoute === '/lists') {

        return isAuthenticated ? (
            <WithAuth>
                <Suspense fallback={<Loading />}>
                    <Lists />
                </Suspense>
            </WithAuth>
        ) : <Login />;

        // HANDLES PATH - /list/:id
    } else if (props.regex.test(props.currentPath)) {
        return isAuthenticated ? (
            <WithAuth>
                <Suspense fallback={<Loading />}>
                    <List />
                </Suspense>
            </WithAuth>
        ) : <Login />;
        // VALID PATH WASN'T FOUND SO RENDER HOME PAGE
    } else {
        return <Home />;
    }
}

/**
 * This component verifies the current route and renders the appropriate component
 */

export default function ViewRenderer(): JSX.Element { // NOSONAR
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const routerContext: IRouterContextType = useRouterContext();
    const { currentRoute }: IRouterContextType = routerContext;
    const currentPath: string = window.location.pathname;
    const listRegex = /^\/list\/[a-z0-9]{24}$/;

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    return isMounted ? (
        <ComponentLoader
            currentRoute={currentRoute}
            currentPath={currentPath}
            regex={listRegex} />
    ) : <Loading />;
}
