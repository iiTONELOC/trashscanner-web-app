import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import type {
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
    AuthenticationResponseJSON,
    RegistrationResponseJSON
} from '@simplewebauthn/typescript-types';

export type WebAuthnRegistrationErrorMessage = {
    message: string;
};

const host = process.env.REACT_APP_GRAPH_QL_SERVER_LOCATION ?? 'http://localhost:3001';

const createOptionURL = (forUserId: string) => host + `/webauthn/attestation/options/${forUserId}`;
const createResultURL = (forUserId: string) => host + `/webauthn/attestation/result/${forUserId}`;
const createLoginOptionsURL = (forUsername: string) => host + `/webauthn/assertion/options/${forUsername}`;
const createLoginResultURL = (forUserId: string) => host + `/webauthn/assertion/result/${forUserId}`;

// REST API
// Registration Steps
// 1. Create options
export const useFetchWebAuthnOptions = (forUserId: string) => {
    const webAuthnOptionURL = createOptionURL(forUserId);
    const fetchWebAuthnOptions = async (): Promise<PublicKeyCredentialCreationOptionsJSON | WebAuthnRegistrationErrorMessage> => {
        const response: PublicKeyCredentialCreationOptionsJSON | WebAuthnRegistrationErrorMessage =
            await fetch(webAuthnOptionURL).then(response => response.json());
        return response;
    };
    return fetchWebAuthnOptions;
};

// 2. Create a registration which will return a credential that can be verified
export const useStartWebAuthnRegistration = async (withTheseOptions: PublicKeyCredentialCreationOptionsJSON): Promise<RegistrationResponseJSON> =>
    await startRegistration(withTheseOptions);


// 3. Send the credential to the server to be verified
export const useVerifyAttestationResult = async (forUserId: string, withThisResult: RegistrationResponseJSON): Promise<boolean> =>
    await fetch(createResultURL(forUserId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(withThisResult)
    }).then(response => response.json());


// function to do all the webauthn registration steps, returns true if successful and false if not
export const useWebAuthnRegistration = (forUserId: string): () => Promise<boolean> => {
    const fetchWebAuthnOptions = useFetchWebAuthnOptions(forUserId);
    const startWebAuthnRegistration = useStartWebAuthnRegistration;
    const verifyAttestationResult = useVerifyAttestationResult;

    const register = async (): Promise<boolean> => {
        const options = await fetchWebAuthnOptions();
        if ('message' in options) {
            throw new Error(options.message);
        }
        const result = await startWebAuthnRegistration(options);
        const verified = await verifyAttestationResult(forUserId, result);
        if (!verified) {
            throw new Error('Could not verify the attestation');
        }
        return verified;
    };

    return register;
};


// Authentication/Login Steps
// 1. Create options
export const useFetchWebAuthnLoginOptions = (forUsername: string): () => Promise<{
    options: PublicKeyCredentialRequestOptionsJSON | WebAuthnRegistrationErrorMessage,
    user: string
}> => {
    const webAuthnLoginOptionsURL = createLoginOptionsURL(forUsername);
    const fetchWebAuthnLoginOptions = async (): Promise<{
        options: PublicKeyCredentialRequestOptionsJSON | WebAuthnRegistrationErrorMessage,
        user: string
    }> => {
        const response: Promise<{
            options: PublicKeyCredentialRequestOptionsJSON | WebAuthnRegistrationErrorMessage,
            user: string
        }> =
            await fetch(webAuthnLoginOptionsURL).then(response => response.json());
        return response;
    };
    return fetchWebAuthnLoginOptions;
};

// 2. Generate an assertion from the options
export const useStartAuthentication = async (withTheseOptions: PublicKeyCredentialRequestOptionsJSON) => await startAuthentication(withTheseOptions);

// 3. Send the assertion to the server to be verified
export const useVerifyAssertionResult = async (withThisResult: AuthenticationResponseJSON, withThisId: string): Promise<boolean> =>
    await fetch(createLoginResultURL(withThisId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(withThisResult)
    }).then(response => response.json());


// function to do all the webauthn login steps, returns true if successful and false if not
export const useWebAuthnLogin = (forUsername: string) => {
    const fetchWebAuthnLoginOptions = useFetchWebAuthnLoginOptions(forUsername);
    const startWebAuthnAuthentication = useStartAuthentication;
    const verifyAssertionResult = useVerifyAssertionResult;

    const login = async () => {
        const { options, user } = await fetchWebAuthnLoginOptions();
        if ('message' in options) {
            throw new Error(options.message);
        }
        const result = await startWebAuthnAuthentication(options);
        const verified = await verifyAssertionResult(result, user);

        if (!verified) {
            throw new Error('Could not verify the assertion');
        }
        return verified;
    };

    return login;
};


export const useWebAuthn = () => {
    return {
        useWebAuthnRegistration,
        useWebAuthnLogin
    };
}
