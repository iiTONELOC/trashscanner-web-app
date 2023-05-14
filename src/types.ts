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
    createdAt: string;
    updatedAt: string;
}

export interface IProduct {
    barcode: string[];
    name: string;
}

export interface IUserProduct {
    _id: string;
    productAlias: string | null;
    productData: IProduct;
    createdAt?: string;
    updatedAt?: string;
}

export interface IListItem {
    _id: string;
    listId?: string;
    isCompleted: boolean;
    userId?: string;
    alias: string | null;
    notes: string | null;
    username?: string | null;
    quantity: number;
    product: IUserProduct;
    createdAt: string;
    updatedAt: string;
}

export interface IList {
    _id: string;
    name: string;
    userId: string;
    products: IListItem[];
    productCount: number;
    itemCount: number;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}



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
