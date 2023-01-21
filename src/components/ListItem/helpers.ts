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
    } else {
        console.log(res.error);
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
    } else {
        console.log(res.error);
    }
}
