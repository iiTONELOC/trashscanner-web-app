import './Forms.css';
import FormInput from '../FormInput';
import { ToastTypes } from '../Toast';
import FormAction from './FormAction';
import { IApiResponse } from '../../types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authentication } from '../../utils/APIs';
import { useInputValidation, IUseValidators } from '../../hooks';
import { IToastMessageContextType, useToastMessageContext, IUserContextType, useUserContext }
    from '../../providers';


interface FormState {
    username: string | null;
    password: string | null;
    email: string | null;
}

const defaultFormState: FormState = {
    username: '',
    password: '',
    email: ''
};


export function SignupForm() {// NOSONAR
    const [formState, setFormState] = useState<FormState>(defaultFormState);
    const [isFormValid, setIsFormValid] = useState<boolean | null>(null);
    const [isMounted, setIsMounted] = useState<boolean | null>(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
    const [emailErrors, setEmailErrors] = useState<string[]>([]);
    const { isAuthenticated, checkIfAuthenticated }: IUserContextType = useUserContext();

    const nav = useNavigate();
    const Toaster: IToastMessageContextType = useToastMessageContext();

    //  Use the useInputValidation hook to validate the inputs
    const validatedPassword: IUseValidators = useInputValidation({
        value: formState.password,
        property: 'password'
    });

    const validatedUsername: IUseValidators = useInputValidation({
        value: formState.username,
        property: 'username'
    });

    const validatedEmail: IUseValidators = useInputValidation({
        value: formState.email,
        property: 'email'
    });

    // watch for validation errors returned from the hook
    useEffect(() => {
        if (isMounted) {
            if (validatedPassword.error.length > 0) {
                setPasswordErrors(validatedPassword.error.map(error => Object.values(error)[0]));
            } else {
                setPasswordErrors([]);
            }
            if (validatedUsername.error.length > 0) {
                setUsernameErrors(validatedUsername.error.map(error => Object.values(error)[0]));
            } else {
                setUsernameErrors([]);
            }
            if (validatedEmail.error.length > 0) {
                setEmailErrors(validatedEmail.error.map(error => Object.values(error)[0]));
            } else {
                setEmailErrors([]);
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        validatedPassword.error,
        validatedUsername.error,
        validatedEmail.error]);


    // manage form state
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.getAttribute('id') || '';
        const { value } = e.target;

        // update the form state
        setFormState({ ...formState, [name]: value });
    };

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
            isAuthenticated && nav('/lists', { replace: true });
            checkIfAuthenticated();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    // validate the form when the form state changes
    useEffect(() => {
        if (isMounted) {

            validatedEmail.validate();
            validatedPassword.validate();
            validatedUsername.validate();

            const isPasswordValid: boolean = validatedPassword.validated;
            const isUsernameValid: boolean = validatedUsername.validated;
            const isEmailValid: boolean = validatedEmail.validated;

            if (isPasswordValid && isUsernameValid && isEmailValid) {
                setIsFormValid(true);
            } else {
                setIsFormValid(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState, validatedPassword.validated, validatedUsername.validated, validatedEmail.validated]);



    const handleSignup = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        const { username, password, email }: FormState = formState;

        Authentication.register(username || '', email || '', password || '').then(
            (response: IApiResponse<string | null>) => {
                // Success
                if (response && response.status === 201) {
                    localStorage.setItem('trash-user', response.data as string);
                    window.location.replace('/lists');
                    // USER OR EMAIL ALREADY EXISTS
                } else if (response && response.status === 400) {
                    //@ts-ignore
                    const errorMessages = response?.error?.map(
                        (error: {
                            property: string,
                            is_valid: boolean,
                            error_messages: { error_code: number, error_message: string }[]
                        }) => error.error_messages.map((
                            messages: {
                                error_code: number,
                                error_message: string
                            }) => error.property + ': ' + messages.error_message));

                    Toaster.makeToast({
                        type: ToastTypes.Error,
                        message: errorMessages.join('\n'),
                        title: 'Error',
                        timeOut: 12000
                    });
                    // ELSE
                } else {
                    throw new Error();
                }
            }
        ).catch((error: Error) => {
            Toaster.makeToast({
                type: ToastTypes.Error,
                message: 'There was an error signing up. Please try again.',
                title: 'Error'
            });
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
                    placeholder="Enter a username"
                    value={formState.username || ''}
                    onChange={handleInputChange}
                    onBlur={validatedUsername.validate}
                    errors={usernameErrors || []}
                />

                <FormInput
                    label="email"
                    type="text"
                    id="email"
                    required
                    placeholder="Enter a valid email"
                    value={formState.email || ''}
                    onChange={handleInputChange}
                    onBlur={validatedEmail.validate}
                    errors={emailErrors || []}
                />

                <FormInput
                    label="password"
                    type="password"
                    id="password"
                    required
                    placeholder="password"
                    value={formState.password || ''}
                    onChange={handleInputChange}
                    onBlur={validatedPassword.validate}
                    errors={passwordErrors || []}
                />

                <FormAction
                    label="SIGN UP"
                    type="signup"
                    isValid={isFormValid || false}
                    onAction={handleSignup}
                />
            </form>
        </>
    ) : <></>;
}
