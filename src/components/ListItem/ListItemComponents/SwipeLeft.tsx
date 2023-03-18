import { DeleteOne } from '.';
import { DecreaseQuantity } from '../hooks';

export default function SwipeLeft(props:
    { _id: string, listId: string, currentQuantity: number, width: number }
): JSX.Element {

    const { decreaseItemQuantity } = DecreaseQuantity({
        listId: props.listId,
        productId: props._id,
        currentQuantity: props.currentQuantity
    });

    const handleDeleteAll = async (): Promise<void> => {
        // for the length of the current quantity, call the decreaseItemQuantity function
        const length = props.currentQuantity;
        for (let i = 0; i < length; i++) {
            await decreaseItemQuantity();
        }

        // remove the entry from local storage
        localStorage.removeItem(`${props.listId}-${props._id}`);
    };

    return (
        <section
            className='Swipe-delete-container'
            // Inline styles are not really the answer but I need to dynamically update the width
            style={{ width: `${props.width}%` }}
            data-swipe-id={props._id}
        >
            <button
                data-delete-all-id={props._id}
                className='Swipe-delete-button Text-shadow'
                onClick={handleDeleteAll}
                type='button'
            >
                Delete All
            </button>

            <DeleteOne {...props} />
        </section>
    );
}
