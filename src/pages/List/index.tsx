import './List.css';
import { UpcDb } from '../../utils/APIs';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IList, IProduct, IUpcDb } from '../../types';
import { ListItem, Loading, LiveUpdateToggler } from '../../components';
import { useGlobalStoreContext, reducerActions } from '../../providers';
import { getItemFromStorage, setItemIntoStorage } from '../../components/ListItem/helpers';


const upcDb: IUpcDb = new UpcDb();


function RenderListItems(props: { products: IProduct[], listId: string }): JSX.Element {
    const { products } = props;

    const countedProducts: { product: IProduct, duplicateCount: number }[] = [];
    const countedIds: Set<string> = new Set();

    // index of the current item in the array
    let itemIndex = 0;

    // set of indexes already used
    const setIndexes: Set<number> = new Set();

    for (const product of products) {
        //  look for the item in local storage
        const itemFromStorage = getItemFromStorage(props.listId, product._id);

        // check to see if we already have the product in the array
        if (countedIds.has(product._id)) {
            const foundProduct = countedProducts
                .find(countedProduct => countedProduct.product._id === product._id);

            // if the product is already in the array, update the duplicate count
            if (foundProduct) {
                foundProduct.duplicateCount++;

                // add the index property to our set tracking used indexes
                itemFromStorage['index'] && setIndexes.add(itemFromStorage['index']);
            }
        } else {
            // if the product is not in the array, add it
            countedIds.add(product._id);

            countedProducts.push({ product, duplicateCount: 0 });
            let isCurrentIndexAlreadySet = setIndexes.has(itemIndex);

            // will be used to set our items index property
            const indexToUse = itemIndex;

            // ensures the index is unique to the list
            while (isCurrentIndexAlreadySet) {
                itemIndex++;
                isCurrentIndexAlreadySet = setIndexes.has(itemIndex);
            }

            // look for an index property
            if (!itemFromStorage['index']) {
                // if it doesn't exist, add one
                itemFromStorage['index'] = indexToUse;
                itemFromStorage['completed'] !== undefined && setItemIntoStorage(props.listId, product._id, itemFromStorage);
                itemIndex++;
            }
        }
    }


    // sort the countedProducts array by the index property
    countedProducts.sort((a, b) => {
        const aIndex = getItemFromStorage(props.listId, a.product._id)['index'];
        const bIndex = getItemFromStorage(props.listId, b.product._id)['index'];

        return aIndex - bIndex;
    });

    return (
        <>
            {countedProducts.map(countedProduct => {
                const { product, duplicateCount } = countedProduct;
                const count: number | undefined = duplicateCount > 0 ? duplicateCount + 1 : undefined;

                return (
                    <ListItem
                        key={product._id}
                        product={product}
                        duplicateCount={count}
                    />
                );
            })}
        </>
    );
}

export default function List(): JSX.Element {// NOSONAR
    const [list, setList] = useState<IList | null>(null);
    const [isMounted, setIsMounted] = useState<null | boolean>(null);

    const { globalState, dispatch } = useGlobalStoreContext();
    const { lists } = globalState;

    const location = useLocation();
    const listId = location.pathname.split('/')[2];


    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            setList(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    listId={listId}
                    db={upcDb}
                    listSetter={setList}
                />
            </header>

            <ul className='List-product-section'>
                <RenderListItems
                    products={list?.products || []}
                    listId={listId}
                />
            </ul>
        </div>

        // the Loading component won't be rendered if we are refetching data in the
        // useEffect hook
    ) : <Loading />;
}
