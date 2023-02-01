import { useDeviceType } from '../../hooks';
import { handleIncreaseQuantity } from './helpers';
import { useGlobalStoreContext, reducerActions, GlobalStoreContextType } from '../../providers';


export default function IncreaseQuantityButton(props: {
    listId: string,
    barcode: string,
}): JSX.Element {
    const { dispatch }: GlobalStoreContextType = useGlobalStoreContext();
    const deviceType = useDeviceType();

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
            className={`List-count-button ${deviceType === 'mobile' ? 'increase-mobile' : 'increase'}`}
            onClick={increaseQuantity}
        >
            <p>+</p>
        </button>
    );
}
