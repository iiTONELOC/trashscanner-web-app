import { linkedList } from '../../utils';
import { useEffect, useState } from 'react';
import { ListItem } from '../../components';
import LinkedList from '../../utils/linkedList';
import { IProduct, ILinkedList } from '../../types';
import { removeItemFromStorage } from '../../components/ListItem/helpers';

// represents the data structure of the list item from storage contained in the linked list
interface IStorageList {
    [key: string]: {
        id: string;
        listEntry: IProduct;
        duplicateCount: number;
    }
}

/**
 * Adds a list of products to an empty linked list
 * @param list The linked list to add the items to
 * @param items a list of items to add to the linked list
 * @returns the updated linked list
 */
function addItemsToEmptyLinkedList(list: ILinkedList<IStorageList>,
    items: { product: IProduct, duplicateCount: number }[], increaseCount = true): ILinkedList<IStorageList> {

    for (const countedProduct of items) {
        const { product, duplicateCount } = countedProduct;
        const count: number = duplicateCount > 0 && increaseCount ? duplicateCount + 1 : duplicateCount;

        const listEntry: IStorageList = {
            [`${product._id}`]: {
                id: product._id,
                listEntry: product,
                duplicateCount: count
            }
        };

        list.add({ ...listEntry });
    }

    return list;
}

/**
 * Adds the individual elements of an array of products to an existing linked list.
 *
 * @param list Existing linked list
 * @param items a list of items to add to the linked list
 * @returns the updated linked list
 */
function addItemsToPopulatedLinkedList(list: ILinkedList<IStorageList>,
    items: { product: IProduct, duplicateCount: number }[]): ILinkedList<IStorageList> {

    for (const countedProduct of items) {
        const { product, duplicateCount } = countedProduct;

        // looks for the product in the list
        const foundProduct = () => {
            const ob = new LinkedList<IStorageList>(list).toObject();
            let found = null;

            for (const item of Object.values(ob)) {
                if (Object.values(item)[0].id === product._id) {
                    found = Object.values(item)[0];
                }
            }
            return found;
        };

        const _foundProduct = foundProduct();

        if (!_foundProduct) {
            // product isn't in the list, so we need to add it
            const count: number = duplicateCount > 0 ? duplicateCount + 1 : 0;

            const listEntry: IStorageList = {
                [`${product._id}`]: {
                    id: product._id,
                    listEntry: product,
                    duplicateCount: count
                }
            };

            list.add({ ...listEntry });
        } else {
            // product is in the list, so we need to update the duplicate count, and any
            // other properties that may have changed
            if (_foundProduct.duplicateCount !== duplicateCount) {
                _foundProduct.duplicateCount = duplicateCount;
                _foundProduct.duplicateCount = _foundProduct.duplicateCount > 0 ?
                    _foundProduct.duplicateCount++ : _foundProduct.duplicateCount;
            }

            // check the name
            _foundProduct.listEntry.product.name !== product.product.name && (
                _foundProduct.listEntry.product.name = product.product.name
            );

            // check the alias
            _foundProduct.listEntry.alias !== product.alias && (
                _foundProduct.listEntry.alias = product.alias
            );

            // check the updated at
            _foundProduct.listEntry.updatedAt !== product.updatedAt && (
                _foundProduct.listEntry.updatedAt = product.updatedAt
            );
        }
    }

    return list;
}

/**
 * Takes in a list of products from the database and returns a condensed rendered list of products
 *
 * Multiple products with the same id are condensed into a single entry with a duplicate count
 * @param props an object containing the products array and the list id
 * @returns The consolidated list of products
 */
export function RenderListItems(props: { products: IProduct[], listId: string }): JSX.Element {
    const [productsArray, setProductsArray] = useState<{ id: string; listEntry: IProduct; duplicateCount: number; }[]>([]);
    const [listObjectToMap, setListObjectToMap] = useState<ILinkedList<IStorageList> | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const countedProducts: { product: IProduct, duplicateCount: number }[] = [];
    const countedIds: Set<string> = new Set();
    const { products } = props;

    const LIST_NAME: string = props.listId;

    // updates the countedProducts array,
    // condensing the products array into single entries with a duplicate count
    const countDuplicates = (): void => {
        // we only want to render the item once, so we need to count the duplicates
        for (const product of products) {
            // check to see if we already have the product in the array
            if (countedIds.has(product._id)) {
                const foundProduct = countedProducts
                    .find(countedProduct => countedProduct.product._id === product._id);

                // if the product is already in the array, update the duplicate count
                foundProduct && foundProduct.duplicateCount++;
            } else {
                // if the product is not in the array, add it
                countedIds.add(product._id);
                countedProducts.push({ product, duplicateCount: 0 });
            }
        }
    };


    const buildLinkedList = (listFromStorage: ILinkedList<IStorageList>): ILinkedList<IStorageList> => {
        // if the linked list is empty
        if (listFromStorage.size() === 0) {
            listFromStorage = addItemsToEmptyLinkedList(listFromStorage, countedProducts, false);
        } else {
            // has existing data
            listFromStorage = addItemsToPopulatedLinkedList(listFromStorage, countedProducts);
        }

        // before returning the list we need to check all the product ids in the list against,
        // the product ids in the products array, if we are using an existing list, there is
        // a chance that the product ids in the list are no longer in the products array
        // so we will have to remove them from the list accordingly as these should be in sync
        // but the React State is our source of truth
        const listID = LIST_NAME;
        // remove duplicate ids from the list
        const productIds: string[] = products
            .map(product => product._id)
            .filter((id, index, self) => self.indexOf(id) === index);

        const idsToRemove: string[] = [];
        const productIdsFromLinkedList: string[] = [];

        const listObject = listFromStorage.toObject();

        // extract the product ids from the object
        for (const item of Object.values(listObject)) {
            productIdsFromLinkedList.push(Object.values(item)[0].id);
        }

        // create an array of ids to remove
        for (const id of productIdsFromLinkedList) {
            if (!productIds.includes(id)) {
                idsToRemove.push(id);
            }
        }

        // remove the ids from localStorage and the linked list
        for (const id of idsToRemove) {

            // this entry in local storage tracks status
            removeItemFromStorage(listID || '', id);

            // update the linked list
            removeItemFromLinkedList(id);
        }


        function removeItemFromLinkedList(id: string) {
            // create an object so we can manipulate the linked list easier
            const listObject = listFromStorage.toObject();

            // we can remove items easily if we know the ids, this was intentionally
            // made to be a PITA so that we don't accidentally remove items
            let index = 0;

            // remove the item from the object
            for (const item of Object.values(listObject)) {
                if (Object.values(item)[0].id === id) {
                    delete listObject[index];
                    break;
                }
                index++;
            }


            // convert the object back to a linked list
            listFromStorage = new LinkedList();
            for (const item of Object.values(listObject)) {
                listFromStorage.add(item);
            }
            // set it back to local storage
            localStorage.setItem(listID || '', JSON.stringify(listFromStorage));
        }

        return listFromStorage;
    };

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // create a linked list from the products array - this ensures that the products are rendered
    // in the order they were added
    useEffect(() => {
        if (isMounted) {
            // get the linked list from local storage or create a new one
            const listFromStorage: ILinkedList<IStorageList> = localStorage.getItem(LIST_NAME) ?
                new linkedList<IStorageList>(JSON.parse(localStorage.getItem(LIST_NAME) as string))
                : new linkedList<IStorageList>();

            // we only want to render the item once, so we need to count the duplicates
            countDuplicates();
            const updatedList = buildLinkedList(listFromStorage);
            // save the linked list data as an object in state
            setListObjectToMap(updatedList);

            // save the linked list data to local storage
            localStorage.setItem(LIST_NAME, JSON.stringify(updatedList));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, products]);

    // generates the productsArray that can be mapped over to render the linked list items
    useEffect(() => {
        if (isMounted) {
            // creates an array from the linked list that is saved in state - this is what we will render
            const tempArray: { id: string; listEntry: IProduct; duplicateCount: number; }[] = [];

            if (listObjectToMap) {
                const ob = new LinkedList<IStorageList>(listObjectToMap).toObject();

                for (const item of Object.values(ob)) {
                    tempArray.push(Object.values(item)[0] as {
                        id: string;
                        listEntry: IProduct;
                        duplicateCount: number;
                    });
                }
            }

            //check the tempArray against the countedProducts array to ensure that the list is up to date
            // if an item exists in the tempArray but not in the countedProducts array, remove it from the tempArray
            tempArray.forEach((tempArrayItem, index) => {
                const foundProduct = products.filter(product => product._id.toString() === tempArrayItem.id.toString());
                // if the product is not in the countedProducts array, remove it from the tempArray
                if (foundProduct.length === 0) {
                    tempArray.splice(index, 1);
                }
            });

            setProductsArray([...tempArray]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, listObjectToMap]);

    return (
        <>
            {
                productsArray.map((listEntry: { id: string; listEntry: IProduct; duplicateCount: number; }) => {
                    const { id, listEntry: product, duplicateCount } = listEntry;
                    const count: number = duplicateCount > 0 ? duplicateCount + 1 : 0;

                    return (
                        <ListItem
                            key={id}
                            product={product}
                            duplicateCount={count}
                        />
                    );
                })
            }
        </>
    );
}
