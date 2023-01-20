import { useRouterContext } from '../../providers';

const isActive = (link: string): boolean => window.location.pathname === link;
const navItemClassName = (link: string): string => `Navigation-item${isActive(link) ? '-active' : ''}`;

interface IProps {
    link: { name: string; href: string };
    afterClick?: () => void;
}

export default function NavLink(props: IProps): JSX.Element {
    const { handleRouteChange } = useRouterContext();
    const { link }: IProps = props;
    const { name, href } = link;

    /**
     * Function that is fired when a user clicks on a navigation link
     */
    const action = () => {
        href === '/logout' && localStorage.removeItem('trash-user');
        href === '/logout' && window.location.replace('/');
        handleRouteChange(href);
        if (props.afterClick) {
            props.afterClick();
        }
    };

    return (
        <li
            role={'navigation'}
            aria-label={'navigation'}
            className={navItemClassName(href)} key={name}>
            <span
                role={'link'}
                tabIndex={0}
                aria-label={'link - ' + name}
                aria-describedby={href}
                onClick={action}>{name}
            </span>
        </li>
    );
}
