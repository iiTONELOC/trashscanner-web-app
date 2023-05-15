import { IJwtPayload } from '../../types';
import { useContext, createContext, useState, useEffect } from 'react';
import UserSessionManager, { isExpired, decodeToken, getToken, tokenName } from './userSessionManager';

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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // if we start out false, the token will always be deleted

    const checkIfAuthenticated = (): boolean => {
        const activeUser = user;

        let _isExpired = true;
        if (activeUser) {
            _isExpired = isExpired(activeUser);
            setIsAuthenticated(!_isExpired);
        } else {
            const token: string | null = getToken();
            _isExpired = isExpired(token || '');
            setUser(token && !_isExpired ? decodeToken(token) : null);
            setIsAuthenticated(!_isExpired);
        }
        return !_isExpired;
    };



    useEffect(() => {
        // if the user isn't authenticated, remove the token from local storage
        if (!isAuthenticated) {
            localStorage.removeItem(tokenName);
            setUser(null);
        }
    }, [isAuthenticated]);


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
