import { IList, IUpcDb } from '../../types';
import { ToastTypes } from '../Toast';
import { UpcDb } from '../../utils/APIs';
import React, { useEffect, useState } from 'react';
import {
    useToastMessageContext, useGlobalStoreContext,
    reducerActions,
    GlobalStoreContextType,
    IToastMessageContextType
} from '../../providers';
import { ui } from '../../utils';

const db: IUpcDb = new UpcDb();

export default function CardDropMenu(props: { //NOSONAR
    listId: string,
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element { //NOSONAR
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
            const response = await db.deleteList(listId);

            const messageType = response ?
                ToastTypes.Success : ToastTypes.Error;
            const message = response ?
                'List deleted successfully' : ErrorMessage;
            const messageTitle = response ?
                'Success' : ErrorTitle;
            const messageTimeOut = response ?
                3000 : ErrorTimeOut;

            response && (() => {
                // remove list from global state
                const currentList: IList = globalState?.lists[listId];
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
            const response = await db.editList(listId, undefined, true);

            const messageType = response ?
                ToastTypes.Success : ToastTypes.Error;
            const message = response ?
                'List set as default successfully' : ErrorMessage;
            const messageTitle = response ?
                'Success' : ErrorTitle;
            const messageTimeOut = response ?
                3000 : ErrorTimeOut;

            response && (() => {
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
                // ________


                // THIS CAN BE MADE REUSABLE
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
                onDoubleClick={handleDelete}
                onTouchStart={(e: React.TouchEvent) => {
                    ui
                        .registerDoubleTap(e, handleDelete);
                }}
            >
                <p className='button-text'>&#128465; Delete</p>
            </button>

            <button className="List-card-drop-button List-set-default-button"
                onClick={handleSetDefault}
            >
                <p>&#128196; Set default</p>
            </button>
        </div>
    ) : <></>;
}
