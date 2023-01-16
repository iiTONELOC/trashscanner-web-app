import './Navigation.css';
import NavLink from './NavLink';
import { useState } from 'react';
import BasicLogo from '../BasicLogo';
import { INavLinks } from '../../types';
import { useIsMobile } from '../../hooks';

import { useNavLinkContext } from '../../providers';
import { CloseIcon, EllipsisMenu } from '../Icons';


// Used on Mobile to show the current page
const CurrentLink = (navLinks: INavLinks['navLinks']): string => { // NOSONAR
    const currentPath = window.location.pathname;
    const currentLink = navLinks.find(link => link.href === currentPath);
    return currentLink ? currentLink.name : 'HOME';
};


export default function Navigation(/*props: INavProps*/): JSX.Element {
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const isMobile: boolean = useIsMobile();

    const { navLinks } = useNavLinkContext();

    const toggleMobileMenu = (): void => setShowMobileMenu(!showMobileMenu);



    return (
        <nav className='Navigation'>
            {
                !isMobile ?
                    (// Desktop Navigation
                        <>
                            <BasicLogo />
                            <ul className='Navigation-list'>
                                {
                                    navLinks.map(link =>
                                        <NavLink
                                            key={link.name}
                                            link={link}
                                        />
                                    )}
                            </ul>
                        </>
                    ) :
                    (// Mobile Navigation
                        <div className='Navigation-mobile'>
                            {/* <p>{CurrentLink(navLinks)}</p> */}

                            <EllipsisMenu
                                className='Navigation-menu-icon'
                                onClick={toggleMobileMenu}
                            />

                            {showMobileMenu ?
                                (
                                    <ul className='Navigation-menu-expanded'>
                                        <CloseIcon
                                            className='Navigation-menu-close'
                                            onClick={toggleMobileMenu}
                                        />

                                        {
                                            navLinks.map(link =>
                                                <NavLink
                                                    key={link.name}
                                                    link={link}
                                                    afterClick={toggleMobileMenu}
                                                />
                                            )
                                        }
                                    </ul>
                                ) : <></>
                            }
                        </div>
                    )
            }
        </nav>
    );
}
