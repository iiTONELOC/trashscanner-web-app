import './Layout.css';

export interface ILayoutProps {
    children: JSX.Element | JSX.Element[];
}

export default function Layout(props: ILayoutProps): JSX.Element {
    const { children }: ILayoutProps = props;

    return (
        <div className='Layout'>
            {children}
        </div>
    );
}
