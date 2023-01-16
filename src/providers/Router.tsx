import { useNavLinkContext } from './navLinks';
import { useContext, createContext, useState } from 'react';

interface RouterContextType {
    currentRoute: string;
    handleRouteChange: (route: string) => void;
}
const RouterContext = createContext<RouterContextType>({} as RouterContextType);

const { Provider } = RouterContext;


export default function RouterProvider(props: React.PropsWithChildren) { // NOSONAR
    const { navLinks } = useNavLinkContext();
    const [currentRoute, setCurrentRoute] = useState(navLinks[0].href);

    const handleRouteChange = (route: string) => {
        window.history.pushState({}, '', route);
        setCurrentRoute(route);
    };

    // listen for nav forward and back events
    window.onpopstate = () => {
        setCurrentRoute(window.location.pathname);
    };

    return <Provider value={{ currentRoute, handleRouteChange }} {...props} />;
};

const useRouterContext = () => useContext(RouterContext);

export { RouterContext, useRouterContext };
