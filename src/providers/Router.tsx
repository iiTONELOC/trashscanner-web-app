import { useContext, createContext, useState } from 'react';

const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'SIGN UP', href: '/signup' },
    { name: 'LOGIN', href: '/login' }
];

interface RouterContextType {
    currentRoute: string;
    handleRouteChange: (route: string) => void;
}
const RouterContext = createContext<RouterContextType>({} as RouterContextType);

const { Provider } = RouterContext;


export default function RouterProvider(props: React.PropsWithChildren) { // NOSONAR
    const [currentRoute, setCurrentRoute] = useState(navLinks[0].href);

    const handleRouteChange = (route: string) => {
        window.history.pushState({}, '', route);
        setCurrentRoute(route);
    };

    return <Provider value={{ currentRoute, handleRouteChange }} {...props} />;
};

const useRouterContext = () => useContext(RouterContext);

export { RouterContext, useRouterContext };
