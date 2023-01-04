import { FormPageContainer, LoginForm } from '../../components';

export default function SignUp(): JSX.Element {
    return (
        <FormPageContainer
            mainTitle='Welcome Back!'
            extendedTitle='Login'
        >

            <LoginForm />
        </FormPageContainer>
    );
}
