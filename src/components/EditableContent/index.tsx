import './EditableContent.css';
import FormInput from '../FormInput';
import { ToastTypes } from '../Toast';
import { IListItem } from '../../types';
import { useState, useEffect } from 'react';
import {
    useToastMessageContext, useGlobalStoreContext,
    reducerActions,
    GlobalStoreContextType,
    IToastMessageContextType
} from '../../providers';



import { useMutation } from '@apollo/client';
import { UPDATE_LIST, UPDATE_LIST_ITEM_ALIAS } from '../../utils/graphQL/mutations';



export enum EditableContentTypes {
    ProductName = 'product-name',
    ListName = 'list-name'
}

interface FormState {
    [EditableContentTypes.ProductName]: string | null;
    [EditableContentTypes.ListName]: string | null;
}


const defaultFormState: FormState = {
    [EditableContentTypes.ProductName]: '',
    [EditableContentTypes.ListName]: ''
};

interface IEditableContentProps {
    setShowEditor: (showEdit: boolean) => void;
    contentType: EditableContentTypes;
    defaultContent: string;
    productId?: string;
    listId?: string;
}

export default function EditableContent(props: { // NOSONAR
    setShowEditor: (showEdit: boolean) => void;
    contentType: EditableContentTypes;
    defaultContent: string;
    productId?: string;
    listId?: string;
}): JSX.Element {
    const [formState, setFormState] = useState<FormState>(defaultFormState);
    const [isMounted, setIsMounted] = useState<boolean | null>(false);

    const { contentType, defaultContent, productId, listId }: IEditableContentProps = props;
    const { globalState, dispatch }: GlobalStoreContextType = useGlobalStoreContext();
    const Toaster: IToastMessageContextType = useToastMessageContext();


    const [updateList] = useMutation(UPDATE_LIST);
    const [updateListItemAlias] = useMutation(UPDATE_LIST_ITEM_ALIAS);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;

        const saferString: string = value.replace(/[^a-zA-Z0-9-:'"., ]/g, '');
        setFormState({ ...formState, [contentType]: saferString });
    };

    async function updateProducts(content: string) {
        try {
            if (content && content !== defaultContent && productId && listId) {
                const { data } = await updateListItemAlias({
                    variables: {
                        userProductId: productId,
                        productAlias: content
                    }
                });

                const haveState = globalState !== null && globalState.lists !== undefined;

                data && haveState && ((() => {
                    const currentListState = globalState?.lists[listId];

                    const editedProducts: IListItem[] = currentListState?.products
                        .map((product: IListItem) => {
                            if (product._id !== productId) {
                                return product;
                            } else {
                                return {
                                    ...product,
                                    alias: content
                                };
                            }
                        });

                    const updatedList = {
                        ...currentListState,
                        products: editedProducts
                    };

                    editedProducts && ((() => {
                        dispatch({
                            type: reducerActions.UPDATE_LIST,
                            payload: {
                                list: updatedList
                            }
                        });

                        // we also have to update the entry in localStorage

                        Toaster.makeToast({
                            type: ToastTypes.Success,
                            message: 'Your product was updated successfully.',
                            title: 'Product updated',
                            timeOut: 4000
                        });
                    })());

                    !editedProducts && (
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
                const { data } = await updateList({
                    variables: {
                        listId,
                        name: listName
                    }
                });


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

    return isMounted && globalState ? (
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
