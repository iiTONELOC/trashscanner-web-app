import { useRouterContext } from '../../providers';

const isActive = (link: string) => window.location.pathname === link;
const navItemClassName = (link: string) => `Navigation-item${isActive(link) ? '-active' : ''}`;

interface IProps {
    link: { name: string; href: string };
    afterClick?: () => void;
}

export default function NavLink(props: IProps) {
    const { link } = props;
    const { handleRouteChange } = useRouterContext();
    const { name, href } = link;

    const action = () => {
        href === '/logout' && localStorage.removeItem('trash-user');
        href === '/logout' && window.location.reload();
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
                aria-label={'link'}
                aria-describedby={href}
                onClick={action}>{name}
            </span>
        </li>
    );
}
