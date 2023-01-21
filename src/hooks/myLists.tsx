import type { IApiHookCall } from '.';
import { UpcDb } from '../utils/APIs';
import { useState, useEffect } from 'react';
import { IApiResponse, IList, IUpcDb } from '../types';

const upcDb: IUpcDb = new UpcDb();
const dataErrorMsg = 'Error fetching lists, please check your internet connection and try again later';

const useMyLists = (): IApiHookCall<IList[]> => {
    const [data, setData] = useState<null | IList[]>(null);
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [isMounted, setIsMounted] = useState<null | boolean>(null);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            reset();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reset = (): void => {
        setIsMounted(null);
        setLoading(null);
        setData(null);
        setError(null);
    };

    const fetchMyLists = (): void => {
        setLoading(true);
        upcDb.getMyLists().then((response: IApiResponse<IList[]>) => {
            if (response.status === 200 || response.data) {
                setData(response.data);
            } else {
                setError(dataErrorMsg);
            }
        }).catch((err: Error) => {
            setError(dataErrorMsg);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (isMounted) {
            fetchMyLists();
        }
    }, [isMounted]);

    const refetch = (): void => {
        if (isMounted) {
            reset();
            fetchMyLists();
        }
    };

    return {
        data,
        error,
        loading,
        refetch
    };
};

export default useMyLists;
