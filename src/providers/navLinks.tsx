import { useContext, createContext, useState, useEffect } from 'react';
import { navLinks as _navLinks, loggedInNavLinks } from '../components';
import { useUserContext } from './user';


interface LinkContextType {
    navLinks: { name: string; href: string; }[];
}

const LinkContext = createContext<LinkContextType>({} as LinkContextType);
const { Provider } = LinkContext;

export default function LinkProvider(props: React.PropsWithChildren) { // NOSONAR
    const { isAuthenticated } = useUserContext();
    const [navLinks, setNavLinks] = useState(isAuthenticated ? loggedInNavLinks : _navLinks);

    useEffect(() => {
        setNavLinks(isAuthenticated ? loggedInNavLinks : _navLinks);
    }, [isAuthenticated]);

    return <Provider value={{ navLinks }} {...props} />;
}

const useNavLinkContext = () => useContext(LinkContext);

export { LinkContext, useNavLinkContext };
