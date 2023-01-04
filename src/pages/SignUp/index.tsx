import { FormPageContainer, SignupForm } from '../../components';

export default function SignUp(): JSX.Element {
    return (
        <FormPageContainer
            mainTitle='Create an'
            mainTitleSpan='Account'
        >

            <SignupForm />
        </FormPageContainer>
    );
}
