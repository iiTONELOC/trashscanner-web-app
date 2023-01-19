import { PlusCircle } from '../Icons';
import { handleIncreaseQuantity } from './helpers';
import { useGlobalStoreContext, reducerActions } from '../../providers';


export default function IncreaseQuantityButton(props: {
    listId: string,
    barcode: string,
}): JSX.Element {
    const { dispatch } = useGlobalStoreContext();

    const increaseQuantity = async (): Promise<void> => await handleIncreaseQuantity({
        listId: props.listId,
        barcode: props.barcode,
        context: {
            dispatch,
            actions: reducerActions
        }
    });

    return (
        <button
            className='List-count-button'
            onClick={increaseQuantity}
        >
            <PlusCircle />
        </button>
    );
}
