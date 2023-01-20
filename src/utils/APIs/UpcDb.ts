import { IApiResponse, IJwtPayload, IList, IProduct } from '../../types';
import jwt_decode from 'jwt-decode';

export interface IUpcDb {
    getMyLists(): Promise<IApiResponse<IList[]>>;
    getList(id: string): Promise<IApiResponse<IList>>;
    deleteList(id: string): Promise<IApiResponse<IList>>;
    createList(name: string, isDefault: boolean): Promise<IApiResponse<IList>>;
    addProductToList(id: string, barcode: string): Promise<IApiResponse<IList>>;
    removeProductFromList(id: string, productId: string): Promise<IApiResponse<IList>>;
    editList(id: string, name?: string, isDefault?: boolean): Promise<IApiResponse<IList>>;
    editProduct(id: string, name: string, barcode?: string): Promise<IApiResponse<IProduct>>;
}


export class UpcDb implements IUpcDb {
    private static readonly API_KEY = process.env.REACT_APP_UPC_DB_API_KEY;
    private static readonly API_URL = process.env.REACT_APP_UPC_DB_URL;
    protected USER: string;
    protected USER_ID?: string;

    constructor() {
        const token = localStorage.getItem('trash-user') || '';
        this.USER = token;
        this.USER_ID = this._getUserId() || undefined;
    }

    async getMyLists(): Promise<IApiResponse<IList[]>> {
        try {
            const response: Response = await fetch(`${UpcDb.API_URL}/lists/user`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error getting lists');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to get lists'
                },
                status: 500,
                data: null
            };
        }
    }

    async getList(id: string): Promise<IApiResponse<IList>> {
        try {
            const response: Response = await fetch(`${UpcDb.API_URL}/lists/${id}`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error getting list');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to get list'
                },
                status: 500,
                data: null
            };
        }
    }

    async addProductToList(id: string, barcode: string): Promise<IApiResponse<IList>> {
        try {
            const response: Response = await fetch(`${UpcDb.API_URL}/lists/${id}/products/${barcode}`, {
                method: 'PUT',
                headers: this._getHeaders()
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error adding product to list');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to add product to list'
                },
                status: 500,
                data: null
            };
        }
    }

    async removeProductFromList(id: string, productId: string): Promise<IApiResponse<IList>> {
        try {
            const response: Response = await fetch(`${UpcDb.API_URL}/lists/${id}/products/${productId}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error removing product from list');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to remove product from list'
                },
                status: 500,
                data: null
            };
        }
    }

    async createList(name: string, isDefault: boolean | null = null): Promise<IApiResponse<IList>> {
        try {
            this.USER_ID = this._getUserId() || undefined;
            const response: Response = await fetch(`${UpcDb.API_URL}/lists`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify({ name, isDefault, userId: this.USER_ID })
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error creating list');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to create list'
                },
                status: 500,
                data: null
            };
        }
    }

    async editList(id: string, name?: string, isDefault: boolean | null = null): Promise<IApiResponse<IList>> {
        try {
            this.USER_ID = this._getUserId() || undefined;
            const response: Response = await fetch(`${UpcDb.API_URL}/lists/${id}`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify({ name, isDefault, userId: this.USER_ID })
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error editing list');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to edit list'
                },
                status: 500,
                data: null
            };
        }
    }

    async deleteList(id: string): Promise<IApiResponse<IList>> {
        try {
            const response: Response = await fetch(`${UpcDb.API_URL}/lists/${id}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error deleting list');
            }
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to delete list'
                },
                status: 500,
                data: null
            };
        }
    }

    // USERS CAN'T EDIT PRODUCTS AT ALL. THEY HAVE ACCESS TO THEIR INDIVIDUAL WRAPPERS
    async editProduct(productId: string, name: string | null): Promise<IApiResponse<IProduct>> {
        console.log('editProduct', productId, name);
        try {
            const response: Response = await fetch(
                `${UpcDb.API_URL}/lists/user/${this.USER_ID}/product/${productId}`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify({ alias: name })
            });

            if (response.status === 200) {
                return response.json();
            } else {
                console.log('editProduct error', response);

                throw new Error('Error editing product');
            }
        } catch (error) {
            console.log('editProduct error', error);
            return {
                error: {
                    message: 'An error occurred while attempting to edit product'
                },
                status: 500,
                data: null
            };
        }
    }


    protected _getHeaders(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${UpcDb.API_KEY}`);
        headers.append('web-app-token', `Bearer ${this.USER}`);
        return headers;
    }

    protected _getUserId(): string | null {
        try {
            const decodedToken: IJwtPayload = jwt_decode(this.USER);
            return decodedToken?.nameid;
        } catch (error) {
            return null;
        }
    }
}



export default UpcDb;
