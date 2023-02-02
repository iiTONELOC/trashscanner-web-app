import { handleIncreaseQuantity } from './helpers';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useGlobalStoreContext, reducerActions, GlobalStoreContextType } from '../../providers';


export default function IncreaseQuantityButton(props: {
    listId: string,
    barcode: string,
}): JSX.Element {
    const { dispatch }: GlobalStoreContextType = useGlobalStoreContext();

    const increaseQuantity = async (): Promise<void> => await handleIncreaseQuantity({
        listId: props.listId,
        barcode: props.barcode,
        context: {
            dispatch,
            actions: reducerActions
        }
    });

    return (
        <PlusCircleIcon
            onClick={increaseQuantity}
            className='increase List-item-quantity-button' />
    );
}
