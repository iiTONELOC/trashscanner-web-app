import './Lists.css';
import { suspender } from '../../utils';
import { UpcDb } from '../../utils/APIs';
import { IList, IUpcDb } from '../../types';
import { ListCard } from '../../components';
import { useEffect, useState } from 'react';
import { useGlobalStoreContext, reducerActions } from '../../providers/globalStore';

const upcDb: IUpcDb = new UpcDb();

const userListData = suspender(upcDb.getMyLists());

export default function Lists(): JSX.Element {// NOSONAR
    const [isMounted, setIsMounted] = useState<null | boolean>(null);

    const listData = userListData.read();
    const { data } = listData;

    const { globalState, dispatch } = useGlobalStoreContext();

    const numLists = data?.length || 0;

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            // Set the lists in the global store
            dispatch({
                type: reducerActions.SET_LISTS,
                payload: {
                    lists: data || []
                }
            });
            //TODO: IMPLEMENT IDB
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isMounted]);

    return isMounted ? (
        <section className='My-lists'>
            <header className='My-lists-header'>
                <h1>My <span>Lists</span></h1>
                <p>({numLists})</p>
            </header>

            <section className='Lists-container'>
                {globalState.lists && [...Object.entries(globalState.lists)].map((
                    list: [string, IList], index: number) => {

                    const key = `${index}`;
                    const props = { ...list[1], key };
                    return (
                        <ListCard
                            {...props}
                        />
                    );
                })}
            </section>
        </section>
    ) : <></>;
}
