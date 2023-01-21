import { ILinkContextType, useNavLinkContext } from './navLinks';
import { useContext, createContext, useState, useEffect } from 'react';


export interface IRouterContextType {
    currentRoute: string;
    handleRouteChange: (route: string) => void;
}
const RouterContext: React.Context<IRouterContextType> = createContext<IRouterContextType>({} as IRouterContextType);
const { Provider }: React.Context<IRouterContextType> = RouterContext;


const BASE_URL = !window.location.href.includes('localhost') ? process.env.REACT_APP_AU || '' : '';
/**
 * Registers navigation changes and updates the current route state
 */
export default function RouterProvider(props: React.PropsWithChildren): JSX.Element { // NOSONAR

    const { navLinks }: ILinkContextType = useNavLinkContext();
    const [currentRoute, setCurrentRoute] = useState<string>(navLinks[0].href);

    const handleRouteChange = (route: string): void => {
        if (!window.location.href.includes(BASE_URL) && window.location.href.includes('localhost')) {
            window.history.pushState({}, '', route);
        } else {
            window.history.pushState({}, '', BASE_URL + route);
        }
        console.log('RouterProvider useEffect');
        console.log({
            base: BASE_URL,
            currentRoute,
            currentPath: window.location.pathname,
        })
        setCurrentRoute(route);
        window.dispatchEvent(new Event('popstate'));
    };

    useEffect(() => {
        // ensure the URL in the address bar is registered on page load
        if (!window.location.href.includes(BASE_URL) && window.location.href.includes('localhost')) {
            handleRouteChange(window.location.pathname);
        } else {
            console.log('RouterProvider useEffect - URL is already registered');
            console.log(window.location.href)
        }



        // listens for nav forward and back events
        window.onpopstate = () => {
            setCurrentRoute(window.location.pathname);
        };
    }, []);

    return <Provider value={{ currentRoute, handleRouteChange }} {...props} />;
};

const useRouterContext = (): IRouterContextType => useContext(RouterContext);

export { RouterContext, useRouterContext };
