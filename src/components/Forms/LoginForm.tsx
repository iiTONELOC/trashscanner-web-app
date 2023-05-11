import './Forms.css';
import FormInput from '../FormInput';
import FormAction from './FormAction';
import { ToastTypes } from '../Toast';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/graphQL/mutations';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import {
    useUserContext, useToastMessageContext, IUserContextType,
    IToastMessageContextType
} from '../../providers';


interface FormState {
    username: string | null;
    password: string | null;
}

const defaultFormState: FormState = {
    username: '',
    password: ''
};


export function LoginForm(): JSX.Element {// NOSONAR
    const [hasError, setHasError] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean | null>(false);
    const [formState, setFormState] = useState<FormState>(defaultFormState);

    const [LoginUser] = useMutation(LOGIN_USER);

    const Toaster: IToastMessageContextType = useToastMessageContext();
    const {
        isAuthenticated,
        setIsAuthenticated,
        checkIfAuthenticated
    }: IUserContextType = useUserContext();

    const nav: NavigateFunction = useNavigate();
    const loc: Location = useLocation();

    useEffect(() => {
        setIsMounted(true);
        checkIfAuthenticated();
        return () => {
            setIsMounted(false);
            setFormState(defaultFormState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            isAuthenticated && nav('/lists');
            checkIfAuthenticated();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    useEffect(() => {
        if (isMounted) {
            const { username, password }: FormState = formState;

            const isUsernameValid: boolean = !!username && username.length > 0;
            const isPasswordValid: boolean = !!password && password.length > 0;

            if (isUsernameValid && isPasswordValid) {
                setIsFormValid(true);
            } else {
                setIsFormValid(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.getAttribute('id') || '';
        const { value } = e.target;

        const safeString = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setFormState({ ...formState, [name]: safeString });
    };

    const handleLogin = async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const loggedInUser = await LoginUser({ variables: { ...formState } });

            const { token } = loggedInUser.data.loginUser;
            if (token) {
                localStorage.setItem('trash-user', token);
                setIsAuthenticated(true);
                setTimeout(() => {
                    // if the user was redirected to the login page, reload their requested
                    // resource, else redirect to the lists page
                    loc.pathname !== '/login' ?
                        window.location.reload() :
                        nav('/lists', { replace: true });
                }, 550);
            } else {
                throw new Error('Invalid Credentials');
            }

        } catch (error: any) {
            Toaster.makeToast({
                type: ToastTypes.Error,
                message: error['message'] || 'Unknown Error',
                title: 'Login Failed',
                timeOut: 7800
            });
            setHasError(true);
        }
    };


    return isMounted ? (
        <>
            <form className='Form-base'>
                <FormInput
                    label="username"
                    type="text"
                    id="username"
                    required
                    placeholder=" Enter a username"
                    value={formState.username || ''}
                    onChange={handleInputChange}
                />

                <FormInput
                    label="password"
                    type="password"
                    id="password"
                    required
                    placeholder="password"
                    value={formState.password || ''}
                    onChange={handleInputChange}
                />

                <FormAction
                    label="LOGIN"
                    type="log in"
                    isValid={isFormValid}
                    onAction={handleLogin}
                    hasError={hasError}
                />
            </form>
        </>
    ) : <></>;
}
