import { FormPageContainer, SignupForm } from '../../components';


export default function SignUp(): JSX.Element {
    return (
        <FormPageContainer
            FormTitle='Create an'
            FormTitleSpan='Account'
        >

            <SignupForm />
        </FormPageContainer>
    );
}
