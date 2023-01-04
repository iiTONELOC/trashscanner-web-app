import './PageContainer.css';


export interface IFormPageContainerProps {
    mainTitle: string;
    mainTitleSpan?: string;
    extendedTitle?: string;
    children: JSX.Element | JSX.Element[];
}

export default function FormPageContainer(props: IFormPageContainerProps): JSX.Element {
    const { mainTitle, mainTitleSpan, extendedTitle, children } = props;
    return (
        <section className='Form-page-container'>
            <h1 className='Form-page-title'>
                {mainTitle} {mainTitleSpan && <span>{mainTitleSpan}</span>}</h1>
            {extendedTitle && <h1>{extendedTitle}</h1>}

            {/* FORM GOES HERE */}
            {children}
        </section>
    );
}
