import { FormPageContainer, SignupForm } from '../../components';
import { useUserContext } from '../../providers';

export default function SignUp(): JSX.Element {
    const { isAuthenticated } = useUserContext();
    isAuthenticated && (window.location.href = '/lists');
    return (
        <FormPageContainer
            mainTitle='Create an'
            mainTitleSpan='Account'
        >

            <SignupForm />
        </FormPageContainer>
    );
}
