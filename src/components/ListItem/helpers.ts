import { IApiResponse, IList, IContext, IUpcDb } from '../../types';
import { UpcDb } from '../../utils/APIs';

const db: IUpcDb = new UpcDb();

interface IHandleIncreaseProps {
    listId: string;
    barcode: string;
    context: IContext;
}
/**
 * Increases the quantity of a product in a list by 1
 * A successful response will update the global state
 */
export async function handleIncreaseQuantity(props: IHandleIncreaseProps) {
    const { listId, barcode, context } = props;
    const res: IApiResponse<IList> = await db.addProductToList(listId, barcode);

    if (res.data) {
        context.dispatch({
            type: context.actions.ADD_TO_LIST,
            payload: {
                list: res.data
            }
        });
    }
}

interface IHandleDecreaseProps {
    listId: string;
    productId: string;
    context: IContext;
}
/**
 * Decreases the quantity of a product in a list by 1
 * A successful response will update the global state
 * If the quantity is 0, the product will be removed from the list
 */
export async function handleDecreaseQuantity(props: IHandleDecreaseProps) {
    const { listId, productId, context } = props;
    const res: IApiResponse<IList> = await db.removeProductFromList(listId, productId);

    if (res.data) {
        context.dispatch({
            type: context.actions.UPDATE_LIST,
            payload: {
                list: res.data
            }
        });
    }
}

/**
 * Returns an item from local storage if it exists an empty object if it doesn't
 * @param listId string, the id of the list
 * @param itemId string, the id of the item
 * @returns `{ completed: boolean} or {}`
 * @example
 * getItemFromStorage('listId', 'itemId')
 * // will return the item from local storage with the key 'listId-itemId'
 * // if the item doesn't exist, it will return an empty object
 */
export
    function getItemFromStorage(listId: string, itemId: string): { completed: boolean, index: number } {
    const itemKey = `${listId}-${itemId}`;
    const item = localStorage.getItem(itemKey) || `{}`;
    const itemObj = JSON.parse(item);
    return itemObj;
}

/**
 * Sets an item into local storage
 * @param listId string, the id of the list
 * @param itemId string, the id of the item
 * @param itemObj `{ completed: boolean }`
 * @returns void
 * @example
 * setItemIntoStorage('listId', 'itemId', { completed: true })
 * // will set the item into local storage with the key 'listId-itemId'
 * // and the value '{ "completed": true }'
 * // if the item already exists, it will be overwritten
 * // if the item doesn't exist, it will be created
*/

export function setItemIntoStorage(listId: string, itemId: string, itemObj: { completed: boolean }): void {
    const itemKey = `${listId}-${itemId}`;
    localStorage.setItem(itemKey, JSON.stringify(itemObj));
}

export function removeItemFromStorage(listId: string, itemId: string): void {
    const itemKey = `${listId}-${itemId}`;
    localStorage.removeItem(itemKey);
}
