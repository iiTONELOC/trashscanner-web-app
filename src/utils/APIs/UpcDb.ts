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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${UpcDb.API_KEY}`,
                    'web-app-token': `Bearer ${this.USER}`
                }
            });

            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error getting lists');
            }
        } catch (error) {
            console.log(error);
            return {
                error: {
                    message: 'An error occurred while attempting to get lists'
                },
                status: 500,
                data: null
            };
        }
    }
}



export default UpcDb;
