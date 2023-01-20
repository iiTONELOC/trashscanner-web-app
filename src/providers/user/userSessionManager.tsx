import { useToastMessageContext, IToastMessageContextType } from '../toastMessage';
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { ToastTypes } from '../../components';
import { IJwtPayload } from '../../types';
import jwt_decode from 'jwt-decode';
import { IUserContextType } from '.';

export const tokenName = 'trash-user';
const MIN_MIL = 60000;
const TEN_MIN_MIL = MIN_MIL * 10;


/**
 * Returns the user's token if it exists
 */
export const getToken = (): string | null => localStorage.getItem(tokenName);

/**
 * Removes the user's token from local storage
 */
export const removeToken = (): void => localStorage.removeItem(tokenName);
/**
 * Checks if the token is expired
 */
export const isExpired = (token: string | IJwtPayload): boolean => {
    if (typeof token == 'string') {
        try {
            const decodedStringToken: IJwtPayload = jwt_decode(token);
            return isExpired(decodedStringToken);
        } catch (error) {
            return true;
        }
    } else if (typeof token == 'object') {
        const { exp } = token;

        if (!exp || exp === undefined) {
            return true;
        }

        const now = Math.floor(Date.now() / 1000);

        return now >= exp;
    } else {
        return true;
    }
};

/**
 * Decodes a base64 encoded json web token
 */
export const decodeToken = (token: string): IJwtPayload | null => {
    try {
        return jwt_decode(token);
    } catch (error) {
        return null;
    }
};


/**
 * Clears a timeout that logs the user out
 */
const clearTokenTimeout = (timerToClear: MutableRefObject<NodeJS.Timeout | null>): void => {
    timerToClear.current && clearTimeout(timerToClear.current);
};


export default function UserSessionManager(props: IUserContextType) { // NOSONAR
    const tokenCollectorId: MutableRefObject<NodeJS.Timeout | null> = useRef(null);
    const { user, setIsAuthenticated, checkIfAuthenticated } = props;
    const Toaster: IToastMessageContextType = useToastMessageContext();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // events that will reset the token expiration
    const tokenResetEvents: string[] = ['keypress', 'touchstart', 'scroll', 'click', 'popstate'];

    // Tokens expire in 60 mins, we log the user out in 10 mins of inactivity
    const resetTokenExpiration = (): void => {
        // clear any existing timeouts
        clearTokenTimeout(tokenCollectorId);
        const token = getToken();

        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                const { exp } = decodedToken;
                const now = Math.floor(Date.now() / 1000);
                const timeToExpire = (exp - now) * 1000;
                const inactivityTime = timeToExpire - (TEN_MIN_MIL);

                /**
                 * Adjusts the time to log out to 10 mins before the token expires to ensure that we
                 * can't make a request with an expired token
                 */
                const adjusted = timeToExpire - inactivityTime > 0 ?
                    timeToExpire - inactivityTime : timeToExpire;

                /**
                 * Adjusts the time to be 10 mins or less. This acts an inactivity timeout
                 * to log the user out. If a user is active, the timeout will be reset in
                 * accordance with the inactivity time and time to expire.
                 */
                const timeToLogOut = (timeToExpire - adjusted) > TEN_MIN_MIL ?
                    TEN_MIN_MIL : (timeToExpire - adjusted);

                tokenCollectorId.current = setTimeout(() => {
                    clearTokenTimeout(tokenCollectorId);
                    setIsAuthenticated(false);
                    removeToken();
                    Toaster.makeToast({
                        message: 'Your session has expired. Please log in again.',
                        type: ToastTypes.Warning,
                        title: 'Session Expired',
                        timeOut: 8500
                    });
                }, timeToLogOut);;
            }
        }
    };


    const reauthenticate = (): void => {
        try {
            const isAuthenticated = checkIfAuthenticated();
            if (!isAuthenticated && user) {
                throw new Error('UserSessionManager: reauthenticate: user is not authenticated');
            } else {
                resetTokenExpiration();
            }
        } catch (error) {
            removeToken();
            clearTokenTimeout(tokenCollectorId);
        }
    };

    // create an event listener to listen for mouse, tap, and keyboard tokenResetEvents
    // on these tokenResetEvents we will reset the token timeout
    const createListeners = (): void => {
        tokenResetEvents.forEach(event => {
            window.addEventListener(event, reauthenticate);
        });
    };

    const removeListeners = (): void => {
        tokenResetEvents.forEach(event => {
            window.removeEventListener(event, reauthenticate);
        });
    };

    useEffect(() => {
        setIsMounted(true);

        return () => {
            setIsMounted(false);
            removeListeners();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // We reauthenticate the user on every page request
    useEffect(() => {
        if (isMounted) {
            reauthenticate();
            createListeners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);
}
