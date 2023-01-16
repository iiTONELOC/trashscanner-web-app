import './MainTitle.css';

export interface IMainTitleProps {
    mainTitle: string;
    mainTitleSpan?: string;
    extendedTitle?: string;
}


export default function MainTitle(props: IMainTitleProps): JSX.Element {
    const { mainTitle, mainTitleSpan, extendedTitle } = props;
    return (

        <section className='Main-title-container'>
            {/* @ts-ignore */}
            <h1 className='Main-title'>
                {mainTitle} {mainTitleSpan && <span>{mainTitleSpan}</span>}
                {extendedTitle && <p className='Main-title-extended'>{extendedTitle}</p>}
            </h1>
        </section>
    );
}
