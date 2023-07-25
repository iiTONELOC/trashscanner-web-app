import './List.css';
import { IList } from '../../types';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useDeviceType } from '../../hooks';
import { useLocation } from 'react-router-dom';
import { GET_LIST } from '../../utils/graphQL/queries';
import { useGlobalStoreContext, reducerActions } from '../../providers';
import { Loading, LiveUpdateToggler, BarcodeScanner, ListItem } from '../../components';


export default function List(): JSX.Element {// NOSONAR
    const device: 'mobile' | 'desktop' = useDeviceType();
    const [isLive, setIsLive] = useState<boolean>(false);
    const [list, setList] = useState<IList | null>(null);
    const [cancel, setCancel] = useState<boolean>(false);
    const [showList, setShowList] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const [detectedBarcode, setDetectedBarcode] = useState<boolean | null>(null);

    const { globalState, dispatch } = useGlobalStoreContext();

    const location = useLocation();
    const listId = location.pathname.split('/')[2];


    const { data, loading, error, refetch } = useQuery(GET_LIST, {
        variables: {
            listId
        }
    });

    const manualButtonLabel: string = device === 'mobile' ?
        '+ Scan Item' : '+ Upload Barcode Image';

    const toggleLive = () => {
        setIsLive(!isLive);
    };

    const handleCancelButton = () => {
        setCancel(true);

        return new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
                // give small amount of time for the component to unmount before forcing it to
                // this ensures that the camera is not still running in the background
            }, 25);
        }).then(() => {
            setShowList(true);
            setCancel(false);
            setIsLive(false);
        });
    };

    const handleLaunchScanner = () => {
        setShowList(false);
        setDetectedBarcode(null);
        // turn on live update
        setIsLive(true);
    };


    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            setList(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (detectedBarcode) {
            //  we need to close the camera and show the list
            handleCancelButton();
        }
    }, [detectedBarcode]);

    // Sets the list data is the component's state
    useEffect(() => {
        if (data) {
            setList(data.list);
            dispatch({
                type: reducerActions.ADD_TO_LISTS,
                payload: {
                    list: data.list
                }
            });
        }

        if (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error]);

    const currentListData = globalState.lists[listId];

    useEffect(() => {
        refetch({ listId }).then(({ data }) => {
            if (data) {
                setList(data.list);
                dispatch({
                    type: reducerActions.UPDATE_LIST,
                    payload: {
                        list: data.list
                    }
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentListData?.itemCount, currentListData?.products?.length]);


    return isMounted && list && !loading ? (
        <div className="List-page-container">
            <header className='My-lists-header'>
                <div className='My-lists-header-title-container'>
                    <h1 data-list-friendly='true'>{list?.name}</h1>
                    <p className='My-lists-header-p'>({list.itemCount || 0})</p>
                </div>

                <LiveUpdateToggler
                    listId={listId}
                    isLive={isLive}
                    listSetter={setList}
                    setIsLive={setIsLive}
                    toggleLive={toggleLive}
                />

            </header>

            <ul
                className='List-product-section'
                data-list-friendly='true'
            >
                {
                    showList ?
                        [...Object.values(list.products)].reverse().map(product => (
                            <ListItem
                                key={`${product._id}`}
                                product={product}
                                listItemId={product._id}
                                isCompleted={product.isCompleted}
                                duplicateCount={product.quantity}
                            />
                        ))
                        :
                        <BarcodeScanner
                            cancel={cancel}
                            listId={listId}
                            dispatch={dispatch}
                            setDetectedBarcode={setDetectedBarcode}
                        />
                }
                <li>
                    <button
                        aria-label={'Add Item Manually'}
                        tabIndex={0}
                        onClick={() => !showList ? handleCancelButton() : handleLaunchScanner()}
                        className={`${showList ? 'Action-button Text-shadow' :
                            'Action-button Text-shadow Cancel'}`}
                    >
                        {showList ? manualButtonLabel : 'Cancel'}
                    </button>
                </li>
            </ul>
        </div>

    ) : <Loading />;
}
