import { IApiResponse } from '../../types';

const API_URL = process.env.REACT_APP_AUTH_SERVER_API_URL;
const API_AUTH = process.env.REACT_APP_AUTH_SERVER_APP_KEY;


export default class Authentication {

    /**
     * Utilizes the Authentication Server API to login a user
     */

    static async login(username: string, password: string):
        Promise<IApiResponse<string | null>> {
        try {
            if (!API_URL || !API_AUTH) {
                throw new Error('API_URL or API_AUTH is not defined');
            }

            const response: Response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'WebApp_Authorization': `Bearer ${API_AUTH}`
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            return response.json();
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to login'
                },
                status: 500,
                data: null
            };
        }
    }

    static async register(username: string, email: string, password: string):
        Promise<IApiResponse<string | null>> {
        try {
            if (!API_URL || !API_AUTH) {
                throw new Error('API_URL or API_AUTH is not defined');
            }

            const response: Response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'WebApp_Authorization': `Bearer ${API_AUTH}`
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            return response.json();
        } catch (error) {
            return {
                error: {
                    message: 'An error occurred while attempting to register'
                },
                status: 500,
                data: null
            };
        }
    }
}
