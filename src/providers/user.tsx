import { useContext, createContext, useState, useEffect, useRef, MutableRefObject } from 'react';
import { useToastMessageContext, IToastMessageContextType } from './toastMessage';
import { useRouterContext } from './Router';
import { ToastTypes } from '../components';
import { IJwtPayload } from '../types';
import jwt_decode from 'jwt-decode';

const tokenName = 'trash-user';
// 13 minutes
const tokenExpiresIn = 13 * 60 * 1000;

export interface UserContextType {
    user: IJwtPayload | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    handleUserChange: () => void;
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

export const decodeToken = (token: string): IJwtPayload | null => {
    try {
        return jwt_decode(token);
    } catch (error) {
        return null;
    }
};

const getToken = (): string | null => localStorage.getItem(tokenName);
const UserContext = createContext<UserContextType>({} as UserContextType);
const { Provider } = UserContext;


export default function UserProvider(props: React.PropsWithChildren) { // NOSONAR
    const [user, setUser] = useState<IJwtPayload | null>(getToken() ? jwt_decode(getToken() || '') : null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isExpired(user || ''));
    const tokenCollectorId: MutableRefObject<NodeJS.Timeout | null> = useRef(null);
    const Toaster: IToastMessageContextType = useToastMessageContext();
    const currentLocation = useRouterContext().currentRoute;

    const handleUserChange = (): void => {
        clearTokenTimeout();
        const token = getToken();

        setUser(token ? jwt_decode(token) : null);
    };

    const clearTokenTimeout = (): void => {
        tokenCollectorId.current && clearTimeout(tokenCollectorId.current);
    };

    // listen to storage changes
    useEffect(() => {
        window.addEventListener('storage', handleUserChange);
        return () => {
            window.removeEventListener('storage', handleUserChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // listen to location or authentication changes
    useEffect(() => {
        handleUserChange();

        if (!isAuthenticated) {
            clearTokenTimeout();
            // explicitly reset the user to null
            setUser(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLocation, isAuthenticated]);

    // listen to user changes
    useEffect(() => {
        // SESSION MANAGER
        // LOGS THE USER OUT 13 MINS AFTER AUTHENTICATION
        // TOKENS ARE ONLY VALID FOR 15 MINUTES
        const tokenCollector = (): NodeJS.Timeout => {
            return setTimeout(() => {
                localStorage.removeItem(tokenName);
                setUser(null);
                setIsAuthenticated(false);
                Toaster.makeToast({
                    message: 'Your credentials have expired. Please login again.',
                    type: ToastTypes.Info
                });
            }, (tokenExpiresIn));
        };

        if (user) {
            setIsAuthenticated(isExpired(user));
            tokenCollectorId.current = tokenCollector();
        } else {
            // IF there was a token collector running but the user is null
            // then the user was logged out
            if (tokenCollectorId.current) {
                // clear the timeout
                clearTimeout(tokenCollectorId.current);
                // reset our ref
                tokenCollectorId.current = null;
                // notify the user
                Toaster.makeToast({
                    message: 'Your credentials have expired. Please login again.',
                    type: ToastTypes.Info
                });
            }

            setIsAuthenticated(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Provider
            value={{
                user,
                isAuthenticated,
                setIsAuthenticated,
                handleUserChange
            }}
            {...props}
        />
    );
}

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext };
