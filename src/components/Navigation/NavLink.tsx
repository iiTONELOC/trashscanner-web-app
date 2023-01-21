import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';



interface IProps {
    link: { name: string; href: string };
    afterClick?: () => void;
}

export default function NavLink(props: IProps): JSX.Element {
    const currentLocation = useLocation();
    const [currentPath, setCurrentPath] = React.useState<string>(currentLocation.pathname);
    const { link }: IProps = props;
    const { name, href } = link;



    const isActive = (link: string): boolean => currentPath === link;
    const navItemClassName = (link: string): string => `Navigation-item${isActive(link) ? '-active' : ''}`;


    const logout = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('trash-user');
        window.location.replace('/');
    };


    useEffect(() => {
        setCurrentPath(currentLocation.pathname);
    }, [currentLocation.pathname]);

    return (
        <li
            role={'navigation'}
            aria-label={'navigation'}
            key={name}
        // onClick={() => setCurrentPath(href)}
        >

            {href !== '/logout' ? (
                <Link
                    className={navItemClassName(href)}
                    to={href}
                    tabIndex={0}
                >
                    {name}
                </Link>
            ) : (
                <a
                    className={navItemClassName(href)}
                    href='/'
                    tabIndex={0}
                    onClick={logout}
                >
                    {name}
                </a>
            )}
        </li>
    )
}
