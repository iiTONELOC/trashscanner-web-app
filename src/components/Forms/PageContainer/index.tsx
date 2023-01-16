import './PageContainer.css';
import { IMainTitleProps } from '../../../types';
import MainTitle from '../../MainTitle';

export interface IFormPageContainerProps extends IMainTitleProps {
    children: JSX.Element | JSX.Element[];
}

export default function FormPageContainer(props: IFormPageContainerProps): JSX.Element {
    const { mainTitle, mainTitleSpan, extendedTitle, children } = props;
    return (
        <section className='Form-page-container'>
            <MainTitle
                mainTitle={mainTitle}
                mainTitleSpan={mainTitleSpan}
                extendedTitle={extendedTitle}
            />

            {/* FORM GOES HERE */}
            {children}
        </section>
    );
}
