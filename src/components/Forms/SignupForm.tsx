import './Forms.css';
import FormInput from '../FormInput';
import { ToastTypes } from '../Toast';
import FormAction from './FormAction';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_NEW_USER, DELETE_USER } from '../../utils/graphQL/mutations';
import { useInputValidation, IUseValidators, useWebAuthn } from '../../hooks';
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
    const [hasError, setHasError] = useState<boolean>(false);

    const [createNewUser] = useMutation(CREATE_NEW_USER);
    const [deleteUser] = useMutation(DELETE_USER);

    const webAuthn = useWebAuthn();

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
        // validatedPassword.error,
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



    const handleSignup = async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();
        // tracks the user, if there is an error when verifying WebAuthn, the created user needs to be deleted
        let newUser: any;

        try {
            newUser = await createNewUser({ variables: { ...formState } });
            const token = newUser.data?.addUser?.token;
            token && localStorage.setItem('trash-user', token);
            // start the webauthn registration process
            const register = webAuthn.useWebAuthnRegistration(newUser.data?.addUser?.user._id);
            const webAuthnRegistrationResult = await register();



            // if we have a new user and the webauthn registration was successful
            // store the token and navigate to the lists page
            if (token && webAuthnRegistrationResult) {
                Toaster.makeToast({
                    type: ToastTypes.Success,
                    message: 'Account created successfully!',
                    title: 'Success!'
                });
                nav('/lists', { replace: true });
            } else {
                // throw an error if the webauthn registration was not successful
                throw new Error('Something went wrong. Please try again later.');
            }
        } catch (error: any) {

            // if there is an error, delete the user (if one was created) so they can try again
            // and not get an username already exists error
            newUser?.data?.addUser?.user && await deleteUser({ variables: { _id: newUser.data?.addUser?.user._id } }).catch(err =>
                console.log('Error deleting user', err)
            );

            newUser && localStorage.removeItem('trash-user');
            const message = error['message'] as string || 'Something went wrong. Please try again later.';
            const messageToDisplay = message.toLowerCase().includes('could not verify the attestation') ?
                'Select an authentication method that supports user verification. Select the Use a phone, tablet, or security key option' : message;

            Toaster.makeToast({
                type: ToastTypes.Error,
                message: messageToDisplay,
                title: 'Error!',
                timeOut: 10000
            });
            setHasError(true);

        }
    };


    return isMounted ? (

        <form className='Form-base'>
            <h1 className='Form-title'>Sign Up</h1>
            <p className='Webauth-notice'>
                TrashScanner&trade; uses WebAuthn/FIDO2 Security tokens to protect your account. You can learn more at <span>
                    <a
                        target='_blank'
                        className='Webauth-link'
                        rel='noreferrer noopener'
                        href='https://webauthn.guide/#about-webauthn'
                    >
                        WebAuthn
                    </a>
                </span>
            </p>

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
                hasError={hasError}
            />
        </form>

    ) : <></>;
}
