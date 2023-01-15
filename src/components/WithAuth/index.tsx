import { useState, useEffect, PropsWithChildren } from 'react';
import { useUserContext } from '../../providers';
import { IJwtPayload } from '../../types';
import { Login } from '../../pages';
import jwt_decode from 'jwt-decode';

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

/**
 * PROTECTS PAGES, IF USER IS NOT LOGGED IN, REDIRECTS TO LOGIN PAGE
 */
export default function WithAuth(props: PropsWithChildren): JSX.Element { // NOSONAR
    const { user } = useUserContext();

    const [isMounted, setIsMounted] = useState<boolean | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isExpired(user || ''));

    const handleAuthentication = (): JSX.Element => {
        if (user && isAuthenticated) {
            return props.children as JSX.Element;
        } else {
            window.history.pushState({}, '', '/login');
            return <Login />;
        }
    };

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        setIsAuthenticated(isExpired(user || ''));
    }, [user]);


    return (
        isMounted ? (handleAuthentication()) : (<></>)
    );
}
