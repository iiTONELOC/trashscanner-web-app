import './Navigation.css';
import NavLink from './NavLink';
import { ui } from '../../utils';
import React, { useState } from 'react';
import BasicLogo from '../BasicLogo';
import { INavLinks } from '../../types';
import { useIsMobile } from '../../hooks';
import { useNavLinkContext } from '../../providers';
import { ArrowLeft, CloseIcon, EllipsisMenu } from '../Icons';
import { useNavigate, NavigateFunction } from 'react-router-dom';


export default function Navigation(): JSX.Element {
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);


    const { navLinks }: INavLinks = useNavLinkContext();
    const navigate: NavigateFunction = useNavigate();
    const isMobile: boolean = useIsMobile();

    const toggleMobileMenu = (e?: React.SyntheticEvent): void => setShowMobileMenu(!showMobileMenu);

    const onMobileBack = (): void => {
        navigate(-1);
    };

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
                                            onTouchStart={
                                                (e: React.TouchEvent) => ui
                                                    .registerSingleTap(e, () => toggleMobileMenu(e))
                                            }
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
