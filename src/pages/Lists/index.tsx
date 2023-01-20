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

    const { lists } = globalState;
    const numLists = lists ? Object.keys(lists).length : 0;

    useEffect(() => {
        setIsMounted(true);
        dispatch({
            type: reducerActions.SET_LISTS,
            payload: {
                lists: data || []
            }
        });
        return () => {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return isMounted ? (
        <section className='My-lists'>
            <header className='My-lists-header'>
                <h1>My <span>Lists</span></h1>
                <p>{numLists}</p>
            </header>

            <section className='Lists-container'>
                {lists && [...Object.entries(lists)].map((
                    list: [string, IList], index: number) => {

                    return (
                        <ListCard
                            key={`${index}`} // NOSONAR
                            {...list[1]}
                        />
                    );
                })}
            </section>
        </section>
    ) : <></>;
}
