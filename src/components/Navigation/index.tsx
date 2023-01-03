import './Navigation.css';
import { useState } from 'react';
import BasicLogo from '../BasicLogo';
import { useIsMobile } from '../../hooks';
import { CloseIcon, EllipsisMenu } from '../Icons';


const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'About', href: '/About' },
    { name: 'Contact', href: '/Contact' }
];

const isActive = (link: string) => window.location.pathname === link;
const navItemClassName = (link: string) => `Navigation-item${isActive(link) ? '-active' : ''}`;

const CurrentLink = (): string => { // NOSONAR
    const currentPath = window.location.pathname;
    const currentLink = navLinks.find(link => link.href === currentPath);
    return currentLink ? currentLink.name : 'HOME';
};

export default function Navigation() {
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const isMobile: boolean = useIsMobile();

    const toggleMobileMenu = (): void => setShowMobileMenu(!showMobileMenu);

    return (

        <nav className='Navigation'>
            {!isMobile ? (
                <>
                    <BasicLogo />
                    <ul className='Navigation-list'>
                        {navLinks.map(link => (
                            <li className={navItemClassName(link.href)} key={link.name}>
                                <a href={link.href}>{link.name} </a>
                            </li>
                        ))}
                    </ul>
                </>
            ) :
                (
                    <div className='Navigation-mobile'>
                        <p>{CurrentLink()}</p>

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
                                        navLinks.map(link => (
                                            <li
                                                key={link.name}
                                                className={navItemClassName(link.href)}>
                                                <a href={link.href}>{link.name} </a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            ) : null
                        }
                    </div>
                )
            }
        </nav>
    );
}
