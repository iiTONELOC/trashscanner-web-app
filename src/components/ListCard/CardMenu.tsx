import { ui } from '../../utils';
import { IList } from '../../types';
import { ToastTypes } from '../Toast';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { TrashIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import { DELETE_LIST, UPDATE_LIST } from '../../utils/graphQL/mutations';
import {
    useToastMessageContext, useGlobalStoreContext,
    reducerActions,
    GlobalStoreContextType,
    IToastMessageContextType
} from '../../providers';



export default function CardDropMenu(props: { //NOSONAR
    listId: string,
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element { //NOSONAR
    const [deleteList] = useMutation(DELETE_LIST);
    const [updateList] = useMutation(UPDATE_LIST);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const Toaster: IToastMessageContextType = useToastMessageContext();
    const { dispatch, globalState }: GlobalStoreContextType = useGlobalStoreContext();


    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleDelete = async () => {
        const { listId } = props;
        const ErrorMessage = 'Failed to delete list';
        const ErrorTitle = 'Error';
        const ErrorTimeOut = 5000;

        try {

            const response = await deleteList({
                variables: {
                    listId
                }
            });

            const deletedList: IList = response?.data?.removeList;

            const messageType = deletedList ? ToastTypes.Success : ToastTypes.Error;
            const message = deletedList ? 'List deleted successfully' : ErrorMessage;
            const messageTitle = deletedList ? 'Success' : ErrorTitle;
            const messageTimeOut = deletedList ? 3000 : ErrorTimeOut;

            deletedList && (() => {
                // remove list from global state
                const currentList: IList = globalState?.lists[listId];

                //update global state
                dispatch({
                    type: reducerActions.DELETE_LIST,
                    payload: { list: { ...currentList } }
                });
            })();

            Toaster.makeToast({
                message,
                title: messageTitle,
                type: messageType,
                timeOut: messageTimeOut
            });

            props.setShowMenu(false);

        } catch (error) {
            Toaster.makeToast({
                message: ErrorMessage,
                title: ErrorTitle,
                type: ToastTypes.Error,
                timeOut: ErrorTimeOut
            });
        }
    };

    const handleSetDefault = async () => {
        const { listId } = props;
        const ErrorMessage = 'Failed to set list as default';
        const ErrorTitle = 'Error';
        const ErrorTimeOut = 5000;

        try {
            const response = await updateList({
                variables: {
                    listId,
                    isDefault: true
                }
            });

            const updatedList: IList = response?.data?.updateList;

            const messageType = updatedList ?
                ToastTypes.Success : ToastTypes.Error;
            const message = updatedList ?
                'List set as default successfully' : ErrorMessage;
            const messageTitle = updatedList ?
                'Success' : ErrorTitle;
            const messageTimeOut = updatedList ?
                3000 : ErrorTimeOut;

            updatedList && (() => {
                // get existing default list

                // THIS CAN BE REUSED ______
                const existingDefaultList: IList | undefined = Object
                    .values(globalState.lists).find(list => list.isDefault);

                const updatedExistingDefaultList = {
                    ...existingDefaultList,
                    isDefault: false
                };
                // set this list to not default in global state by dispatching an action
                dispatch({
                    type: reducerActions.UPDATE_LIST,
                    payload: { list: { ...updatedExistingDefaultList as IList } }
                });

                const listToSetAsDefault = globalState.lists[listId];
                const updatedListToSetAsDefault = {
                    ...listToSetAsDefault,
                    isDefault: true
                };
                props.setShowMenu(false);
                // set this list to default in global state by dispatching an action
                dispatch({
                    type: reducerActions.UPDATE_LIST,
                    payload: { list: { ...updatedListToSetAsDefault as IList } }
                });
            })();

            Toaster.makeToast({
                message,
                title: messageTitle,
                type: messageType,
                timeOut: messageTimeOut
            });

        } catch (error) {
            Toaster.makeToast({
                message: ErrorMessage,
                title: ErrorTitle,
                type: ToastTypes.Error,
                timeOut: ErrorTimeOut
            });
        }
    };


    return isMounted ? (
        <div className="List-card-drop-menu">
            <button className="List-card-drop-button List-delete-button"
                onDoubleClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                }}
                onTouchStart={(e: React.TouchEvent) => {
                    ui
                        .registerDoubleTap(e, handleDelete);
                }}
            >
                <TrashIcon className="List-set-icon" />
                <p>Delete</p>
            </button>

            <button className="List-card-drop-button List-set-default-button"
                onClick={handleSetDefault}
            >
                <DocumentCheckIcon className="List-set-icon" />
                <p>Set default</p>
            </button>
        </div>
    ) : <></>;
}
