//  REDUCER and CONTEXT TYPES
import type { IAction, IPayloads, GlobalStoreContextType } from './providers';
// COMPONENT TYPES
export type {
    IToastProps,
    ToastTypes,
    ILayoutProps,
    IFormInputProps,
    IMainFormTitleProps
} from './components';


//  HOOK TYPES
export type {
    IValidationRules,
    IUseValidators,
    IValidationError,
    IApiHookCall
} from './hooks';

//  UTIL TYPES
export type {
    IMyNode,
    IValidator,
    ILinkedList,
} from './utils';

// NAV
export interface INavLinks {
    navLinks: { name: string; href: string; }[];
}

//  AUTHENTICATION
export interface IJwtPayload {
    unique_name: string;
    email: string;
    nameid: string;
    nbf: number;
    exp: number;
    iat: number;
}

// API RESPONSES
export interface IApiResponse<T> {
    status: number;
    data: T | null;
    error: { message: string } | null;
};

// UPC DB Data
export interface ISource {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProduct {
    _id: string;
    listId?: string;
    userId?: string;
    alias: string | null;
    product: {
        barcode: string[];
        name: string;
        source: ISource;
        url?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }
    createdAt: Date;
    updatedAt: Date;
}

export interface IList {
    _id: string;
    name: string;
    userId: string;
    products: IProduct[];
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// UPC DB API
export type { IUpcDb } from './utils/APIs/UpcDb';


// PROVIDERS

// USER
export type { IUserContextType } from './providers';


// GLOBAL STORE
export interface IContext {
    dispatch: React.Dispatch<IAction<IPayloads>>;
    actions: { [key: string]: string };
}

export type { IAction, IPayloads, GlobalStoreContextType };

// TOAST MESSAGING
export type { IToastMessageContextType } from './providers/toastMessage';
