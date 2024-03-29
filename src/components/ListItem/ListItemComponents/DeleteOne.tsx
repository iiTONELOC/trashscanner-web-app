import { DecreaseQuantity } from '../hooks';

export default function DeleteAllSwipeLeft(props: { _id: string, listId: string, currentQuantity: number, width: number }): JSX.Element {

    const { decreaseItemQuantity } = DecreaseQuantity({
        listId: props.listId,
        listItemId: props._id,
        currentQuantity: props.currentQuantity
    });

    return (

        <button
            data-delete-one-id={props._id}
            className='Swipe-delete-one-button Text-shadow'
            type='button'
            onClick={decreaseItemQuantity}
        >
            - 1
        </button>

    );
}
