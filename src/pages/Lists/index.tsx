import './Lists.css';
import { IList } from '../../types';
import { suspender } from '../../utils';
import { UpcDb } from '../../utils/APIs';
import { ListCard } from '../../components';
import { useEffect, useState } from 'react';
import { useGlobalStoreContext, reducerActions } from '../../providers/globalStore';

const upcDb = new UpcDb();

const userListData = suspender(upcDb.getMyLists());

export default function Lists(): JSX.Element {// NOSONAR
    const listData = userListData.read();
    const { data } = listData;
    const numLists = data?.length || 0;
    const { globalState, dispatch } = useGlobalStoreContext();
    const [isMounted, setIsMounted] = useState<null | boolean>(null);

    useEffect(() => {
        setIsMounted(true);
        // Set the lists in the global store
        dispatch({
            type: reducerActions.SET_LISTS,
            payload: {
                lists: data || []
            }
        });
        //TODO: IMPLEMENT IDB
        return () => setIsMounted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return isMounted ? (
        <section className='My-lists'>
            <header className='My-list-header'>
                <h1>My <span>Lists</span></h1>
                <p>({numLists})</p>
            </header>

            <section className='List-container'>
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
