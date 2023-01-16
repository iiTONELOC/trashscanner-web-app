import './PageContainer.css';
import { IMainFormTitleProps } from '../../../types';
import MainFormTitle from '../../MainFormTitle/index';

export interface IFormPageContainerProps extends IMainFormTitleProps {
    children: JSX.Element | JSX.Element[];
}

export default function FormPageContainer(props: IFormPageContainerProps): JSX.Element {
    const { FormTitle, FormTitleSpan, extendedTitle, children } = props;
    return (
        <section className='Form-page-container'>
            <MainFormTitle
                FormTitle={FormTitle}
                FormTitleSpan={FormTitleSpan}
                extendedTitle={extendedTitle}
            />

            {/* FORM GOES HERE */}
            {children}
        </section>
    );
}
