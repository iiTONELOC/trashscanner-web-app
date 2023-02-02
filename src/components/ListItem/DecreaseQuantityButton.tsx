import { ui } from '../../utils';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import { handleDecreaseQuantity, removeItemFromStorage } from './helpers';
import { useGlobalStoreContext, reducerActions, GlobalStoreContextType } from '../../providers';


export default function DecreaseQuantityButton(props: {
    listId: string,
    productId: string,
    currentQuantity: number
}): JSX.Element {
    const { dispatch }: GlobalStoreContextType = useGlobalStoreContext();

    const decreaseQuantityInState = async (): Promise<void> => await handleDecreaseQuantity({
        listId: props.listId,
        productId: props.productId,
        context: {
            dispatch,
            actions: reducerActions
        }
    });

    const decreaseItemQuantity = (): void => {
        // if the quantity is 1, and we are deleting the item,
        // we need to remove it from local storage as well
        if (props.currentQuantity === 1) {
            removeItemFromStorage(props.listId, props.productId);
        }

        decreaseQuantityInState();
    };

    return (
        <MinusCircleIcon
            onDoubleClick={decreaseItemQuantity}
            onTouchStart={(e: React.TouchEvent) => ui.registerDoubleTap(e, decreaseItemQuantity)}
            className='decrease List-item-quantity-button' />
    );
}
