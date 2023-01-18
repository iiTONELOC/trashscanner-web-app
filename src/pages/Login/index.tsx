import { FormPageContainer, LoginForm } from '../../components';

export default function SignUp(): JSX.Element {
    return (
        <FormPageContainer
            FormTitle='Welcome Back!'
            extendedTitle='Login'
        >

            <LoginForm />
        </FormPageContainer>
    );
}
