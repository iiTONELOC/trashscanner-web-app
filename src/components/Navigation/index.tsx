import './Navigation.css';
import NavLink from './NavLink';
import { useState } from 'react';
import BasicLogo from '../BasicLogo';
import { useIsMobile } from '../../hooks';

import { useNavLinkContext } from '../../providers';
import { CloseIcon, EllipsisMenu } from '../Icons';


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
