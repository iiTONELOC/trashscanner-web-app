import { useUserContext } from './user';

import type { IUserContextType } from './user';
import { useLocation } from 'react-router-dom';
import { useContext, createContext, useState, useEffect } from 'react';
import { navLinks as _navLinks, loggedInNavLinks } from '../components';

export interface ILinkContextType {
    navLinks: { name: string; href: string; }[];
}

const LinkContext: React.Context<ILinkContextType> = createContext<ILinkContextType>({} as ILinkContextType);
const { Provider }: React.Context<ILinkContextType> = LinkContext;

/**
 * Generates the appropriate navigation links based on the user's authentication status
 */
export default function LinkProvider(props: React.PropsWithChildren): JSX.Element { // NOSONAR
    const { isAuthenticated }: IUserContextType = useUserContext();
    const [navLinks, setNavLinks] = useState<ILinkContextType['navLinks']>(
        isAuthenticated ? loggedInNavLinks : _navLinks);

    const currentLocation = useLocation();

    useEffect(() => {
        setNavLinks(isAuthenticated ? loggedInNavLinks : _navLinks);
    }, [isAuthenticated, currentLocation.pathname]);

    return <Provider value={{ navLinks }} {...props} />;
}

const useNavLinkContext = (): ILinkContextType => useContext<ILinkContextType>(LinkContext);

export { LinkContext, useNavLinkContext };
