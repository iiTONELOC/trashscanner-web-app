import { ILinkContextType, useNavLinkContext } from './navLinks';
import { useContext, createContext, useState, useEffect } from 'react';


export interface IRouterContextType {
    currentRoute: string;
    handleRouteChange: (route: string) => void;
}
const RouterContext: React.Context<IRouterContextType> = createContext<IRouterContextType>({} as IRouterContextType);
const { Provider }: React.Context<IRouterContextType> = RouterContext;


/**
 * Registers navigation changes and updates the current route state
 */
export default function RouterProvider(props: React.PropsWithChildren): JSX.Element { // NOSONAR
    const { navLinks }: ILinkContextType = useNavLinkContext();
    const [currentRoute, setCurrentRoute] = useState<string>(navLinks[0].href);

    const handleRouteChange = (route: string): void => {
        window.history.pushState({}, '', route);
        setCurrentRoute(route);
        window.dispatchEvent(new Event('popstate'));
    };

    useEffect(() => {
        // ensure the URL in the address bar is registered on page load
        handleRouteChange(window.location.pathname);

        // listens for nav forward and back events
        window.onpopstate = () => {
            setCurrentRoute(window.location.pathname);
        };
    }, []);

    return <Provider value={{ currentRoute, handleRouteChange }} {...props} />;
};

const useRouterContext = (): IRouterContextType => useContext(RouterContext);

export { RouterContext, useRouterContext };
