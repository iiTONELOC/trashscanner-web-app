import './List.css';
import { UpcDb } from '../../utils/APIs';
import { useEffect, useState } from 'react';
import { ListItem, Loading } from '../../components';
import { IList, IProduct, IUpcDb } from '../../types';
import { useGlobalStoreContext, reducerActions } from '../../providers';

const upcDb: IUpcDb = new UpcDb();


function RenderListItems(props: { products: IProduct[] }): JSX.Element {
    const { products } = props;

    let previousId = '';
    let duplicateCount = 0;

    const countedProducts: { product: IProduct, duplicateCount: number }[] = [];

    // loop over the products and count the duplicates
    for (const product of products) {
        if (product._id === previousId) {
            duplicateCount++;
            // look and see if the product is already in the countedProducts array
            const foundProduct = countedProducts
                .find(countedProduct => countedProduct.product._id === product._id);

            if (foundProduct) {
                // if the product is already in the array, update the duplicate count
                foundProduct.duplicateCount = duplicateCount;
            } else {
                // if the product is not in the array, add it
                countedProducts.push({ product, duplicateCount });
            }
        } else {
            previousId = product._id;
            duplicateCount = 0;
            // add the product to the array
            countedProducts.push({ product, duplicateCount });
        }
    }

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

    const listId: string | null = window.location.pathname.split('/')[2] || null;
    const { globalState, dispatch } = useGlobalStoreContext();
    const { lists } = globalState;

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


    return isMounted && list ? (
        <div className="List-page-container">
            <header className='My-lists-header'>
                <h1>{list?.name}</h1>
                <p className='My-lists-header-p'>({list?.products?.length || 0})</p>
            </header>

            <ul className='List-product-section'>
                <RenderListItems products={list?.products || []} />
            </ul>
        </div>

        // the Loading component won't be rendered if we are refetching data in the
        // useEffect hook
    ) : <Loading />;
}
