import { DeleteOne } from '.';
import { DecreaseQuantity } from '../hooks';
import { TrashIcon } from '@heroicons/react/24/solid';


export default function SwipeLeft(props:
    { _id: string, listId: string, currentQuantity: number, width: number }
): JSX.Element {

    const { decreaseItemQuantity } = DecreaseQuantity({
        listId: props.listId,
        productId: props._id,
        currentQuantity: props.currentQuantity
    });

    const handleDeleteAll = async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        for (let i = 0; i < props.currentQuantity; i++) {
            await decreaseItemQuantity();
        }
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
                onClick={async (e: React.SyntheticEvent) => handleDeleteAll(e)}
                type='button'
            >
                <TrashIcon
                    onClick={async (e: React.SyntheticEvent) => handleDeleteAll(e)}
                    className='Delete-all-icon'
                /> All
            </button>

            <DeleteOne {...props} />
        </section>
    );
}
