import './List.css';
import { UpcDb } from '../../utils/APIs';
import { useEffect, useState } from 'react';
import { RenderListItems } from './helpers';
import { IList, IUpcDb } from '../../types';
import { useDeviceType } from '../../hooks';
import { useLocation } from 'react-router-dom';
import { useGlobalStoreContext, reducerActions } from '../../providers';
import { Loading, LiveUpdateToggler, BarcodeScanner } from '../../components';

const upcDb: IUpcDb = new UpcDb();

export default function List(): JSX.Element {// NOSONAR
    const device: 'mobile' | 'desktop' = useDeviceType();
    const [isLive, setIsLive] = useState<boolean>(false);
    const [list, setList] = useState<IList | null>(null);
    const [cancel, setCancel] = useState<boolean>(false);
    const [showList, setShowList] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const [detectedBarcode, setDetectedBarcode] = useState<boolean | null>(null);

    const { globalState, dispatch } = useGlobalStoreContext();
    const { lists } = globalState;

    const location = useLocation();
    const listId = location.pathname.split('/')[2];

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
        if (listId && isMounted) {
            const _list = lists ? lists[listId] || null : null;

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
                                lists: [data]
                            }
                        });
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, listId, lists]);


    return isMounted && list ? (
        <div className="List-page-container">
            <header className='My-lists-header'>
                <div className='My-lists-header-title-container'>
                    <h1>{list?.name}</h1>
                    <p className='My-lists-header-p'>({list?.products?.length || 0})</p>
                </div>

                <LiveUpdateToggler
                    db={upcDb}
                    listId={listId}
                    isLive={isLive}
                    listSetter={setList}
                    setIsLive={setIsLive}
                    toggleLive={toggleLive}
                />

            </header>

            <ul className='List-product-section'>
                {
                    showList ?
                        <RenderListItems
                            products={list?.products || []}
                            listId={listId}
                        />
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
