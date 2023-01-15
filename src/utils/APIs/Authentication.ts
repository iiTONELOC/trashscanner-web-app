const API_URL = process.env.REACT_APP_AUTH_SERVER_API_URL;

const API_AUTH = process.env.REACT_APP_AUTH_SERVER_APP_KEY;

export interface IJwtPayload {
    unique_name: string;
    email: string;
    nameid: string;
    nbf: number;
    exp: number;
    iat: number;
}

export default class Authentication {

    /**
     * Utilizes the Authentication Server API to login a user
     */

    static async login(username: string, password: string) {
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
            console.log(error);

            return {
                error: 'Error while trying to login'
            };
        }
    }
}
