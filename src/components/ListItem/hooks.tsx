import { useMutation } from '@apollo/client';
import { REMOVE_ITEM_FROM_LIST, ADD_BARCODE_TO_LIST } from '../../utils/graphQL/mutations';
import { useGlobalStoreContext, reducerActions, GlobalStoreContextType } from '../../providers';


export function DecreaseQuantity(props: { // NOSONAR
    listItemId: string,
    listId: string,
    currentQuantity: number
}): { decreaseItemQuantity: () => Promise<void> } {
    const { globalState, dispatch }: GlobalStoreContextType = useGlobalStoreContext();
    const [removeItemFromList] = useMutation(REMOVE_ITEM_FROM_LIST);


    const decreaseQuantityInState = async (): Promise<void> => {
        const result = await removeItemFromList({
            variables: {
                listId: props.listId,
                listItemId: props.listItemId
            }
        });

        if (result.data) {

            const updatedProductQuantity = [...globalState.lists[props.listId].products].map(product => {
                if (product._id === props.listItemId) {
                    return {
                        ...product,
                        quantity: product.quantity - 1
                    };
                }
                return {
                    ...product
                };
            }).filter(product => product.quantity > 0);

            dispatch({
                type: reducerActions.UPDATE_LIST,
                payload: {
                    list: {
                        ...globalState.lists[props.listId],
                        itemCount: globalState.lists[props.listId].itemCount - 1,
                        products: updatedProductQuantity
                    }
                }
            });
        }
    };

    const decreaseItemQuantity = async (): Promise<void> => {
        await decreaseQuantityInState();
    };

    return {
        decreaseItemQuantity
    };
}

export function IncreaseQuantity(props: { // NOSONAR
    listId: string,
    barcode: string,
}): { increaseQuantity: () => Promise<void> } {
    const { globalState, dispatch }: GlobalStoreContextType = useGlobalStoreContext();
    const [addBarcodeToList] = useMutation(ADD_BARCODE_TO_LIST);

    // console.log(globalState)

    const increaseQuantity = async (): Promise<void> => {
        const result = await addBarcodeToList({
            variables: {
                listId: props.listId,
                barcode: props.barcode
            }
        });

        const updatedProductQuantity = [...globalState.lists[props.listId].products].map(product => {
            if (product.product.productData.barcode.includes(props.barcode)) {
                return {
                    ...product,
                    quantity: product.quantity + 1
                };
            }

            return {
                ...product
            };
        });


        if (result.data) {
            dispatch({
                type: reducerActions.UPDATE_LIST,
                payload: {
                    list: {
                        ...globalState.lists[props.listId],
                        itemCount: globalState.lists[props.listId].itemCount + 1,
                        products: updatedProductQuantity
                    }
                }
            });
        }
    };

    return {
        increaseQuantity
    };
}
const defaultExports = {
    DecreaseQuantity,
    IncreaseQuantity
};

export default defaultExports;

