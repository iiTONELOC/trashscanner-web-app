import { IJwtPayload } from '../../types';
import { useContext, createContext, useState, useEffect } from 'react';
import UserSessionManager, { isExpired, decodeToken, getToken } from './userSessionManager';

export interface IUserContextType {
    user: IJwtPayload | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    checkIfAuthenticated: () => boolean;
}

const UserContext: React.Context<IUserContextType> = createContext<IUserContextType>({} as IUserContextType);
const { Provider }: React.Context<IUserContextType> = UserContext;

/**
 * Provides user context and session management
 */

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

    useEffect(() => {
        checkIfAuthenticated();
        console.log('UserProvider mounted');
        console.log(isAuthenticated)
    }, []);

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

const useUserContext = (): IUserContextType => useContext<IUserContextType>(UserContext);

export { UserContext, useUserContext, isExpired, decodeToken };
