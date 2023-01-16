import { FormPageContainer, SignupForm } from '../../components';
import { useUserContext, useRouterContext } from '../../providers';

export default function SignUp(): JSX.Element {
    const { isAuthenticated } = useUserContext();
    const { handleRouteChange } = useRouterContext();

    isAuthenticated && handleRouteChange('/lists');

    return (
        <FormPageContainer
            mainTitle='Create an'
            mainTitleSpan='Account'
        >

            <SignupForm />
        </FormPageContainer>
    );
}
