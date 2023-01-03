import './Layout.css';

interface LayoutProps {
    children: JSX.Element | JSX.Element[];
}

export default function Layout(props: LayoutProps): JSX.Element {
    const { children } = props;

    return (
        <div className='Layout'>
            {children}
        </div>
    );
}
