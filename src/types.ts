// COMPONENT TYPES
export type {
    ILayoutProps,
    IFormInputProps
} from './components';

//  HOOK TYPES
export type {
    IValidationRules,
    IValidationError
} from './hooks';

//  UTIL TYPES
export type {
    IValidator
} from './utils';

// NAV
export interface INavLinks {
    navLinks: { name: string; href: string; }[];
}

//  AUTHENTICATION
export type { IJwtPayload } from './utils/APIs';
