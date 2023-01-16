import { FormPageContainer, LoginForm } from '../../components';
import { useUserContext, useRouterContext } from '../../providers';

export default function SignUp(): JSX.Element {
    const { isAuthenticated } = useUserContext();
    const { handleRouteChange } = useRouterContext();

    isAuthenticated && handleRouteChange('/lists');

    return (
        <FormPageContainer
            FormTitle='Welcome Back!'
            extendedTitle='Login'
        >

            <LoginForm />
        </FormPageContainer>
    );
}
