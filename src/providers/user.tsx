import { useContext, createContext, useState, useEffect } from 'react';
import { IJwtPayload } from '../types';
import jwt_decode from 'jwt-decode';
import { useRouterContext } from './Router';

const tokenName = 'trash-user';

interface UserContextType {
    user: IJwtPayload | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const isExpired = (token: string | IJwtPayload): boolean => {
    if (typeof token == 'string') {
        try {
            jwt_decode(token);
            return true;
        } catch (error) {
            return false;
        }
    } else if (typeof token == 'object') {
        const { exp } = token;
        const now = Math.floor(Date.now() / 1000);
        return now < exp;
    } else {
        return false;
    }
};


const UserContext = createContext<UserContextType>({} as UserContextType);
const { Provider } = UserContext;

const getToken = (): string | null => localStorage.getItem(tokenName);


export default function UserProvider(props: React.PropsWithChildren) { // NOSONAR
    const [user, setUser] = useState<IJwtPayload | null>(getToken() ? jwt_decode(getToken() || '') : null);
    const currentLocation = useRouterContext().currentRoute;
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isExpired(user || ''));

    const handleUserChange = (): void => {
        // storage was accessed check if it was a set or get item
        const token = getToken();
        setUser(token ? jwt_decode(token) : null);
    };

    useEffect(() => {
        handleUserChange();
    }, [currentLocation]);


    return <Provider value={{ user, isAuthenticated, setIsAuthenticated }} {...props} />;
}

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext };
