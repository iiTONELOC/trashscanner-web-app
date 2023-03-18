export { default as useMyLists } from './myLists';
export { default as useIsMobile } from './isMobile';
export { default as useDeviceType } from './deviceType';
export { default as useSwipe, Direction } from './useSwipe';
export { default as useInputValidation } from './inputValidation';

export type { IValidationRules, IValidationError, IUseValidators } from './inputValidation';

export interface IApiHookCall<T> {
    data: T | null;
    error: string | null;
    loading: boolean | null;
    refetch: () => void;
}

export type { ISwipeConfig, DirectionInfo } from './useSwipe';
