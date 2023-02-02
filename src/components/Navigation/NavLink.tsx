import { ui } from '../../utils';
import React, { useEffect } from 'react';
import { useUserContext, IUserContextType } from '../../providers';
import { Link, useLocation, useNavigate, Location, NavigateFunction } from 'react-router-dom';
import { useIsMobile } from '../../hooks';


interface IProps {
    link: { name: string; href: string };
    afterClick?: () => void;
}

export default function NavLink(props: IProps): JSX.Element {
    const currentLocation: Location = useLocation();
    const isMobile: boolean = useIsMobile();

    const [currentPath, setCurrentPath] = React.useState<string>(currentLocation.pathname);
    const { link }: IProps = props;
    const { name, href } = link;

    const navigate: NavigateFunction = useNavigate();
    const { setIsAuthenticated }: IUserContextType = useUserContext();

    const isActive = (link: string): boolean => currentPath === link;
    const navItemClassName = (link: string): string => `Navigation-item${isActive(link) ? '-active' : ''}`;


    const logout = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('trash-user');
        setIsAuthenticated(false);
        navigate('/', { replace: true });
        props.afterClick && props.afterClick();
    };


    useEffect(() => {
        setCurrentPath(currentLocation.pathname);
    }, [currentLocation.pathname]);

    /**
     * These Touch Callbacks timeout so that the navigation can take place
     * before the menu is closed. This is to prevent the menu from immediately
     * closing after the user clicks on a link.
     */
    const mobileNavTouch = (e: React.TouchEvent) => ui.registerSingleTap(e, () => {
        navigate(href, { replace: true });
        setTimeout(() => {
            props.afterClick && props.afterClick();
        }, 150);
    });

    const mobileTouchLogout = (e: React.TouchEvent) => ui.registerSingleTap(e, () => {
        setTimeout(() => {
            logout(e);
            props.afterClick && props.afterClick();
        }, 150);
    });

    const handleNavClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        navigate(href, { replace: true });
        props.afterClick && props.afterClick();
    };

    return (
        <li
            role={'navigation'}
            aria-label={'navigation'}
            key={name}
        >

            {href !== '/logout' ? (
                <Link
                    className={navItemClassName(href)}
                    to={href}
                    replace={true}
                    tabIndex={0}
                    onClick={isMobile ? handleNavClick : undefined}
                    onTouchStart={isMobile ? mobileNavTouch : undefined}
                >
                    {name}
                </Link>
            ) : (
                <a
                    className={navItemClassName(href)}
                    href='/'
                    tabIndex={0}
                    onClick={logout}
                    onTouchStart={isMobile ? mobileTouchLogout : undefined}
                >
                    {name}
                </a>
            )}
        </li>
    );
}
