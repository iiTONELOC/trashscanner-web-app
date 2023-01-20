import './EditableContent.css';
import FormInput from '../FormInput';
import { ToastTypes } from '../Toast';
import { IProduct } from '../../types';
import { UpcDb } from '../../utils/APIs';
import { useState, useEffect } from 'react';
import {
    useToastMessageContext, useGlobalStoreContext,
    reducerActions
} from '../../providers';


export enum EditableContentTypes {
    ProductName = 'product-name',
    ListName = 'list-name'
}

interface FormState {
    [EditableContentTypes.ProductName]: string | null;
    [EditableContentTypes.ListName]: string | null;
}

const db = new UpcDb();

const defaultFormState: FormState = {
    [EditableContentTypes.ProductName]: '',
    [EditableContentTypes.ListName]: ''
};

export default function EditableContent(props: { // NOSONAR
    setShowEditor: (showEdit: boolean) => void;
    contentType: EditableContentTypes;
    defaultContent: string;
    productId?: string;
    listId?: string;
}): JSX.Element {
    const [formState, setFormState] = useState<FormState>(defaultFormState);
    const [isMounted, setIsMounted] = useState<boolean | null>(false);
    const { contentType, defaultContent, productId, listId } = props;
    const { globalState, dispatch } = useGlobalStoreContext();
    const Toaster = useToastMessageContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        // replace it with a server safe string escape all bad characters
        const safeString = value.replace(/[^a-zA-Z0-9 ]/g, '');
        setFormState({ ...formState, [contentType]: safeString });
    };

    // To: Create Hooks for CRUD Ops that can be used in any component

    async function updateProducts(content: string) {
        try {
            if (content && content !== defaultContent && productId && listId) {
                const { data } = await db.editProduct(productId, content);

                data && ((() => {
                    const currentListState = globalState?.lists[listId];
                    const filteredProducts: IProduct[] = currentListState?.products
                        .filter((product: IProduct) => product._id !== productId);

                    const updatedProducts = [...filteredProducts, data];

                    const updatedList = {
                        ...currentListState,
                        products: updatedProducts
                    };

                    updatedProducts && ((() => {
                        dispatch({
                            type: reducerActions.UPDATE_LIST,
                            payload: {
                                list: updatedList
                            }
                        });

                        Toaster.makeToast({
                            type: ToastTypes.Success,
                            message: 'Your product was updated successfully.',
                            title: 'Product updated',
                            timeOut: 4000
                        });
                    })());

                    !updatedProducts && (
                        (() => { throw new Error(); })());
                })());
                !data && ((
                    () => { throw new Error(); })());
            }
        } catch (error) {
            Toaster.makeToast({
                type: ToastTypes.Error,
                message: 'There was an error updating your product.',
                title: '',
                timeOut: 8000
            });
        }
    }

    async function updateListName(listName: string) {
        try {
            if (listName && listName !== defaultContent && listId) {
                const { data } = await db.editList(listId, listName);
                data && ((() => {
                    const currentListState = globalState?.lists[listId];
                    const updatedList = {
                        ...currentListState,
                        name: listName
                    };

                    updatedList && (
                        (() => {
                            dispatch({
                                type: reducerActions.UPDATE_LIST,
                                payload: {
                                    list: updatedList
                                }
                            });

                            Toaster.makeToast({
                                type: ToastTypes.Success,
                                message: 'Your list was updated successfully.',
                                title: 'List updated',
                                timeOut: 4000
                            });
                        })()
                    );

                    !updatedList && (
                        (() => { throw new Error(); })()
                    );
                })());
                !data && (
                    (() => { throw new Error(); })()
                );
            }
        } catch (error) {
            Toaster.makeToast({
                type: ToastTypes.Error,
                message: 'There was an error updating your list.',
                title: '',
                timeOut: 8000
            });
        }
    }

    const sendUpdate = async (): Promise<void> => {
        const { [contentType]: content } = formState;

        if (contentType === 'product-name') {
            await updateProducts(content || defaultContent);
        }

        if (contentType === 'list-name') {
            await updateListName(content || defaultContent);
        }

        props.setShowEditor(false);
    };

    useEffect(() => {
        setIsMounted(true);
        setFormState({ ...formState, [contentType]: defaultContent });
        return () => {
            setIsMounted(false);
            setFormState(defaultFormState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isMounted ? (
        <div className='Editable-content-container'>
            <FormInput
                type='textarea'
                id={contentType}
                label={contentType}
                onBlur={sendUpdate}
                onChange={handleChange}
                value={formState[contentType] || ''}
            />
        </div>
    ) : <></>;
};
