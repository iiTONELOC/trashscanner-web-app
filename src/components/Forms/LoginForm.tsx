import './Forms.css';
import { ToastTypes } from '../Toast';
import FormInput from '../FormInput';
import FormAction from './FormAction';
import { useState, useEffect } from 'react';
import { Authentication } from '../../utils/APIs';
import { useUserContext, useToastMessageContext } from '../../providers';

interface FormState {
    username: string | null;
    password: string | null;
}

const defaultFormState: FormState = {
    username: '',
    password: ''
};


export function LoginForm() {// NOSONAR
    const [isMounted, setIsMounted] = useState<boolean | null>(false);
    const [formState, setFormState] = useState<FormState>(defaultFormState);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const { isAuthenticated } = useUserContext();
    const Toaster = useToastMessageContext();

    useEffect(() => {
        setIsMounted(true);
        isAuthenticated && window.location.replace('/lists');
        return () => {
            setIsMounted(false);
            setFormState(defaultFormState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            const { username, password } = formState;

            const isUsernameValid = username && username.length > 0;
            const isPasswordValid = password && password.length > 0;

            if (isUsernameValid && isPasswordValid) {
                setIsFormValid(true);
            } else {
                setIsFormValid(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.getAttribute('id') || '';
        const { value } = e.target;

        const safeString = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setFormState({ ...formState, [name]: safeString });
    };

    const handleLogin = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const { username, password } = formState;

        Authentication.login(username || '', password || '').then(res => {
            if (res.status === 200) {
                res.data && localStorage.setItem('trash-user', res.data);

                // IF a user's token doesn't exist they may be redirected to the login page
                // component, even thought the URL is not /login.
                // IF this is the case a successful login should redirect the user to the
                // requested resource
                window.location.pathname !== '/login' ?
                    window.location.replace(window.location.pathname) :
                    window.location.replace('/lists');

            } else {
                Toaster.makeToast({
                    type: ToastTypes.Error,
                    message: 'Server Error',
                    title: 'Login Failed',
                    timeOut: 7800
                });
                console.error(res);
            }
        }).catch((err) => {
            console.log(err);
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
                />

            </form>

        </>
    ) : <></>;
}
