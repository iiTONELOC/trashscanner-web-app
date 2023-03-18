import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { IncreaseQuantity } from '../hooks';


export default function IncreaseQuantityButton(props: {
    listId: string,
    barcode: string,
}): JSX.Element {
    const { increaseQuantity } = IncreaseQuantity(props);

    return (
        <PlusCircleIcon
            onClick={increaseQuantity}
            className='increase List-item-quantity-button' />
    );
}
