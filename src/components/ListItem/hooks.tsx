import { handleDecreaseQuantity, handleIncreaseQuantity, removeItemFromStorage } from './helpers';
import { useGlobalStoreContext, reducerActions, GlobalStoreContextType } from '../../providers';

export function DecreaseQuantity(props: { // NOSONAR
    listId: string,
    productId: string,
    currentQuantity: number
}): { decreaseItemQuantity: () => Promise<void> } {
    const { dispatch }: GlobalStoreContextType = useGlobalStoreContext();

    const decreaseQuantityInState = async (): Promise<void> => await handleDecreaseQuantity({
        listId: props.listId,
        productId: props.productId,
        context: {
            dispatch,
            actions: reducerActions
        }
    });

    const decreaseItemQuantity = async (): Promise<void> => {
        // if the quantity is 1, and we are deleting the item,
        // we need to remove it from local storage as well
        if (props.currentQuantity === 1) {
            removeItemFromStorage(props.listId, props.productId);
        }

        await decreaseQuantityInState();
    };

    return {
        decreaseItemQuantity
    };
}

export function IncreaseQuantity(props: { // NOSONAR
    listId: string,
    barcode: string,
}): { increaseQuantity: () => Promise<void> } {
    const { dispatch }: GlobalStoreContextType = useGlobalStoreContext();

    const increaseQuantity = async (): Promise<void> => await handleIncreaseQuantity({
        listId: props.listId,
        barcode: props.barcode,
        context: {
            dispatch,
            actions: reducerActions
        }
    });

    return {
        increaseQuantity
    };
}
const defaultExports = {
    DecreaseQuantity,
    IncreaseQuantity
};

export default defaultExports;

