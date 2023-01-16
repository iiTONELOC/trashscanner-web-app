import './List.css';
import { IList } from '../../types';
import { UpcDb } from '../../utils/APIs';
import { useEffect, useState } from 'react';
import { useGlobalStoreContext, reducerActions } from '../../providers';

const upcDb = new UpcDb();

export default function List() {// NOSONAR
    const listId: string | null = window.location.pathname.split('/')[2] || null;
    const { globalState, dispatch } = useGlobalStoreContext();
    const { lists } = globalState;
    const [list, setList] = useState<IList | null>(null);
    const [isMounted, setIsMounted] = useState<null | boolean>(null);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sets the list data is the component's state
    useEffect(() => {
        if (listId && lists && isMounted) {
            const _list = lists[listId];

            if (_list) {
                // if list data exists in global store, set it in the component's state
                setList(_list);
            } else {
                // if list data does not exist in global store, fetch it from the API
                // and set it in the global store
                upcDb.getList(listId).then(res => {
                    const { data } = res;
                    if (data) {
                        setList(data);
                        dispatch({
                            type: reducerActions.SET_LISTS,
                            payload: {
                                list: data
                            }
                        });
                    }
                });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, listId, lists]);

    useEffect(() => {
        if (list) {
            console.log("LIST: ", list);
        }
    }, [list]);

    return isMounted ? (
        <div className="List">
            I am a list
        </div>
    ) : <></>;
}
