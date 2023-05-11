import './Lists.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_LISTS } from '../../utils/graphQL/queries';
import { IList, GlobalStoreContextType } from '../../types';
import { AddListForm, ListCard, Loading, ToastTypes } from '../../components';
import {
    useGlobalStoreContext, reducerActions, useToastMessageContext,
    IToastMessageContextType
} from '../../providers';


export default function Lists(): JSX.Element {// NOSONAR
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<null | boolean>(null);

    const { globalState, dispatch }: GlobalStoreContextType = useGlobalStoreContext();
    const Toaster: IToastMessageContextType = useToastMessageContext();
    const { lists }: GlobalStoreContextType['globalState'] = globalState;


    const { error, loading, data } = useQuery(GET_MY_LISTS, {
        fetchPolicy: 'network-only'
    });


    const numLists = lists ? Object.keys(lists).length : 0;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted && data) {
            dispatch({
                type: reducerActions.SET_LISTS,
                payload: {
                    lists: [...data.myLists]
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.myLists?.length]);

    useEffect(() => {
        if (error && isMounted) {
            Toaster.makeToast({
                message: error?.message || 'Error fetching lists, please check your internet connection and try again later',
                type: ToastTypes.Error,
                timeOut: 12000,
                title: 'Data Error'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, isMounted]);


    return isMounted && data && !loading ? (
        <section className='My-lists'>
            <header className='My-lists-header'>
                {!showAddForm ?
                    (<>
                        <h1>My <span>Lists</span></h1>
                        <p>({numLists})</p>
                    </>)
                    : (<h1>Add <span>List</span></h1>)}
            </header>

            {!showAddForm ? (
                <section className='Lists-container'>
                    {!loading && lists ? (

                        [...Object.entries(lists)]
                            .map((list: [string, IList], index: number) => (
                                <ListCard
                                    {...list[1]}
                                    key={`${list}`} // NOSONAR
                                />
                            ))) : (<Loading />)}
                </section>
            ) : (
                <AddListForm
                    showAddForm={showAddForm}
                    setShowAddForm={setShowAddForm}
                />
            )}

            {!showAddForm &&
                <div className='Action-button-container Lists-add-list'>
                    <button
                        aria-label={'Add List'}
                        tabIndex={0}
                        onClick={() => setShowAddForm(!showAddForm)}
                        className='Action-button Text-shadow'
                    >
                        + Add List
                    </button>
                </div>
            }
        </section>
    ) : <Loading />;
}
