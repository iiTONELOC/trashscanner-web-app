import { IncreaseQuantity } from '../hooks';

export default function AddOneOnSwipeRight(props: { _id: string, width: number, barcode: string, listId: string }): JSX.Element {
    const { increaseQuantity } = IncreaseQuantity({
        listId: props.listId,
        barcode: props.barcode
    });

    return (
        <section
            className='Swipe-add-container'
            // Inline styles are not really the answer but I need to dynamically update the width
            style={{ width: `${props.width}%` }}
            data-swipe-id={props._id}
        >
            <button
                onClick={increaseQuantity}
                data-add-one-id={props._id}
                className='Swipe-add-button Text-shadow'
                type='button'
            >
                + 1
            </button>
        </section>
    );
}
