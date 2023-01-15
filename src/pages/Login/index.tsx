import { FormPageContainer, LoginForm } from '../../components';
import { useUserContext } from '../../providers';

export default function SignUp(): JSX.Element {
    const { isAuthenticated } = useUserContext();
    isAuthenticated && (window.location.href = '/lists');

    return (
        <FormPageContainer
            mainTitle='Welcome Back!'
            extendedTitle='Login'
        >

            <LoginForm />
        </FormPageContainer>
    );
}
