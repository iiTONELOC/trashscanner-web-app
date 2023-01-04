import './Forms.css';
import FormInput from '../FormInput';
import FormAction from './FormAction';
import { useState, useEffect } from 'react';


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

        // update the form state
        // seralize the value into html friendly string
        const safeString = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setFormState({ ...formState, [name]: safeString });
    };

    const handleLogin = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();


        console.log('login');
        console.log({
            formState
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
