import './Forms.css';
import FormInput from '../FormInput';
import FormAction from './FormAction';
import { ToastTypes } from '../Toast';
import { useState, useEffect } from 'react';
import { Authentication } from '../../utils/APIs';
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

    const handleLogin = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        const { username, password }: FormState = formState;

        Authentication.login(username || '', password || '').then(res => {
            if (res.status === 200) {
                res.data && (
                    () => {
                        localStorage.setItem('trash-user', res.data);
                        setIsAuthenticated(true);
                    }
                )();

                // IF a user's token doesn't exist they may be redirected to the login page
                // component, even thought the URL is not /login.
                // IF this is the case a successful login should redirect the user to the
                // requested resource

                // a timeout is used to allow the token to be activated. A Not before error
                // occurs if the redirect happens at the exact same time as token activation
                setTimeout(() => {
                    // if the user was redirected to the login page, reload their requested
                    // resource, else redirect to the lists page
                    loc.pathname !== '/login' ?
                        window.location.reload() :
                        nav('/lists', { replace: true });
                }, 550);

            } else if (res.status === 401) {
                Toaster.makeToast({
                    type: ToastTypes.Error,
                    message: 'Invalid Credentials',
                    title: 'Login Failed',
                    timeOut: 7800
                });
                setHasError(true);
            }
            else {
                throw new Error();
            }
        }).catch(err => {
            Toaster.makeToast({
                type: ToastTypes.Error,
                message: 'Server Error',
                title: 'Login Failed',
                timeOut: 7800
            });
            setHasError(true);
        });
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
