import { IApiResponse, IList } from '../../types';

export class UpcDb {
    private static readonly API_KEY = process.env.REACT_APP_UPC_DB_API_KEY;
    private static readonly API_URL = process.env.REACT_APP_UPC_DB_URL;
    protected USER: string;

    constructor() {
        const token = localStorage.getItem('trash-user') || '';
        this.USER = token;
    }

    async getMyLists(): Promise<IApiResponse<IList[]>> {
        try {
            const response = await fetch(`${UpcDb.API_URL}/lists/user`, {
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
            const response = await fetch(`${UpcDb.API_URL}/lists/${id}`, {
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


    private _getHeaders(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${UpcDb.API_KEY}`);
        headers.append('web-app-token', `Bearer ${this.USER}`);
        return headers;
    }
}



export default UpcDb;
