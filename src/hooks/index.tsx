export { default as useIsMobile } from './isMobile';
export { default as useDeviceType } from './deviceType';
export { default as useSwipe, Direction } from './useSwipe';
export { default as useInputValidation } from './inputValidation';
export {
    useFetchWebAuthnOptions, useStartWebAuthnRegistration, useVerifyAttestationResult,
    useWebAuthnRegistration, useWebAuthn, useFetchWebAuthnLoginOptions, useVerifyAssertionResult, useWebAuthnLogin
} from './webAuthn';

export interface IApiHookCall<T> {
    data: T | null;
    error: string | null;
    loading: boolean | null;
    refetch: () => void;
}

export type { ISwipeConfig, DirectionInfo, IUseSwipe } from './useSwipe';
export type { IValidationRules, IValidationError, IUseValidators } from './inputValidation';
