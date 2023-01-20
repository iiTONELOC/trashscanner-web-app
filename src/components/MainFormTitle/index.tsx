import './MainFormTitle.css';

export interface IMainFormTitleProps {
    FormTitle: string;
    FormTitleSpan?: string;
    extendedTitle?: string;
}


export default function MainFormTitle(props: IMainFormTitleProps): JSX.Element {
    const { FormTitle, FormTitleSpan, extendedTitle }: IMainFormTitleProps = props;

    return (
        <section className='Main-title-container'>
            <h1 className='Main-title'>
                {FormTitle} {FormTitleSpan && <span>{FormTitleSpan}</span>}
                {extendedTitle && <p className='Main-title-extended'>{extendedTitle}</p>}
            </h1>
        </section>
    );
}
