import type { IApiHookCall } from '.';
import { UpcDb } from '../utils/APIs';
import { useState, useEffect } from 'react';
import { IApiResponse, IList, IUpcDb } from '../types';

const upcDb: IUpcDb = new UpcDb();
const dataErrorMsg = 'Error fetching List, please check your internet connection and try again later';

const useMyLists = (props: { listId: string }): IApiHookCall<IList> => {
    const [data, setData] = useState<null | IList>(null);
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

    const fetchMyList = (): void => {
        setLoading(true);
        upcDb.getList(props.listId).then((response: IApiResponse<IList>) => {
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
            fetchMyList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    const refetch = (): void => {
        if (isMounted) {
            reset();
            fetchMyList();
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
