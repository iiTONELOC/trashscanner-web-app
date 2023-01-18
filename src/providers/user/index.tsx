import UserSessionManager, { isExpired, decodeToken, getToken } from './userSessionManager';
import { useContext, createContext, useState } from 'react';
import { IJwtPayload } from '../../types';

const UserContext = createContext<IUserContextType>({} as IUserContextType);
const { Provider } = UserContext;

export interface IUserContextType {
    user: IJwtPayload | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    checkIfAuthenticated: () => boolean;
}

export default function UserProvider(props: React.PropsWithChildren) { // NOSONAR
    const [user, setUser] = useState<IJwtPayload | null>(getToken() ? decodeToken(getToken() || '') : null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    /*
     * Fetches the token from local storage, decodes it, and sets the user state
     * Then sets the isAuthenticated state depending on the token's validity
     * Returns true if the token is valid, false otherwise
     */
    const checkIfAuthenticated = (): boolean => {
        const token = getToken();
        const _isExpired = isExpired(token || '');
        setUser(token && !_isExpired ? decodeToken(token) : null);
        setIsAuthenticated(!_isExpired);
        return !_isExpired;
    };

    // Manages the user's session and validates a user on every requested page
    UserSessionManager({ user, isAuthenticated, setIsAuthenticated, checkIfAuthenticated });

    return (
        <Provider
            value={{
                user,
                isAuthenticated,
                setIsAuthenticated,
                checkIfAuthenticated
            }}
            {...props}
        />
    );
}

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext, isExpired, decodeToken };
