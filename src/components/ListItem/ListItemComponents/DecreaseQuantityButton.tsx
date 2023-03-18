import { ui } from '../../../utils';
import { DecreaseQuantity } from '../hooks';
import { MinusCircleIcon } from '@heroicons/react/24/solid';



export default function DecreaseQuantityButton(props: {
    listId: string,
    productId: string,
    currentQuantity: number
}): JSX.Element {
    const { decreaseItemQuantity } = DecreaseQuantity(props);

    return (
        <MinusCircleIcon
            onDoubleClick={decreaseItemQuantity}
            onTouchEnd={(e: React.TouchEvent) => ui.registerDoubleTap(e, decreaseItemQuantity)}
            className='decrease List-item-quantity-button' />
    );
}
