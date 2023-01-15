import './Forms.css';
import FormInput from '../FormInput';
import FormAction from './FormAction';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../providers';
import { Authentication } from '../../utils/APIs';

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

    useEffect(() => {
        setIsMounted(true);
        // holds any validation errors
        return () => {
            setIsMounted(false);
            setFormState(defaultFormState);
        };
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
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem('trash-user', res.data);
                // redirect to home page
                window.location.replace('/lists');
            } else {
                window.alert('Login failed');
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
