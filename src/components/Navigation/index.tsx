import './Navigation.css';
import NavLink from './NavLink';
import { useState } from 'react';
import BasicLogo from '../BasicLogo';
import { useIsMobile } from '../../hooks';

import { useNavLinkContext } from '../../providers';
import { ArrowLeft, CloseIcon, EllipsisMenu } from '../Icons';


export default function Navigation(/*props: INavProps*/): JSX.Element {
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const isMobile: boolean = useIsMobile();

    const { navLinks } = useNavLinkContext();

    const toggleMobileMenu = (): void => setShowMobileMenu(!showMobileMenu);

    // handle the back button on mobile, it should navigate back to the previous state
    // if it is in the history

    const onMobileBack = (): void => {
        // set the location to the previous state
        window.history.back();
    };

    return (
        <nav className='Navigation'>
            {
                !isMobile ?
                    (// Desktop Navigation
                        <>
                            <BasicLogo

                            />
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
                            <ArrowLeft
                                className='Navigation-back-arrow'
                                onClick={onMobileBack}
                            />

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
