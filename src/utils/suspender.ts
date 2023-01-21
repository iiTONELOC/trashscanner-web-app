import { IApiResponse } from '../types';

const suspender = <T>(promise: Promise<IApiResponse<T>>): { read: () => IApiResponse<T> } => {
    let status = 'pending';
    let response: IApiResponse<T>;


    const _suspend: Promise<void> = promise.then(
        res => {
            status = 'success';
            response = res;
        },
        err => {
            status = 'error';
            response = err;
        }
    );

    const read = (): IApiResponse<T> => {
        switch (status) {
            case 'pending':
                throw _suspend;
            case 'error':
                throw response;
            default:
                return response;
        }
    };

    return { read };
};

export default suspender;
