// COMPONENT TYPES
export type {
    ILayoutProps,
    IMainTitleProps,
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
    barcode: string[];
    name: string;
    source: ISource;
    url?: string;
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

