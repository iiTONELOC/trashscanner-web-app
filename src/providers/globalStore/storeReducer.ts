import { useReducer } from 'react';
import { IList, IListItem } from '../../types';
import {
    SET_LISTS, ADD_TO_LISTS, UPDATE_LIST,
    DELETE_LIST, ADD_NEW_LIST, ADD_ITEM_TO_LIST
} from './storeActions';

export interface IDefaultGlobalState {
    lists: {
        [key: string]: IList;
    };
}

interface IAction<T> {
    type: string;
    payload: T;
}

interface IPayloads {
    lists?: IList[];
    list?: IList;
    addToList?: {
        listId: string;
        item: any;
    }
}

export const reducer = (state: IDefaultGlobalState, action: IAction<IPayloads>) => {
    const listId = action?.payload?.list?._id;
    switch (action.type) {
        case SET_LISTS:
            return {
                ...state,
                lists:
                    action.payload.lists?.map(l => ({ [l._id]: l }))
                        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
            };
        case ADD_TO_LISTS:
            const id = action?.payload?.list?._id;
            if (!id) {
                return {
                    ...state
                };
            }
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [id]: action.payload.list
                }
            };

        case ADD_NEW_LIST:
        case UPDATE_LIST:
            if (!listId) {

                return {
                    ...state
                };
            }

            const updatedState = {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: action.payload.list
                }
            };

            return updatedState;

        case ADD_ITEM_TO_LIST:
            // get the list id from the payload
            const listIdToAddTo = action?.payload?.addToList?.listId;
            if (!listIdToAddTo) {
                return state;
            }

            // get the item to add to the list
            const itemToAdd = action?.payload?.addToList?.item;
            if (!itemToAdd) {
                return state;
            }

            // get the list from the state
            const listToAddTo = { ...state.lists[listIdToAddTo] };

            if (!listToAddTo) {
                return state;
            }

            // look for the item in the list
            const itemIndex = listToAddTo.products.findIndex((i: IListItem) => i._id === itemToAdd._id);

            // if the item is not in the list, add it
            if (itemIndex === -1) {
                listToAddTo.products = [...listToAddTo.products, itemToAdd];
            }

            // if the item is in the list, update the quantity
            else {
                listToAddTo.products[itemIndex].quantity += itemToAdd.quantity;
            }

            // update the list in the state
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listIdToAddTo]: listToAddTo
                }
            };


        case DELETE_LIST:
            const listIdToDelete = action?.payload?.list?._id;
            if (!listIdToDelete) {
                return state;
            }
            const { [listIdToDelete]: _, ...lists } = state.lists;
            return {
                ...state,
                lists
            };
        default:
            return state;
    }
};

const defaultState: IDefaultGlobalState = { lists: {} };
// @ts-ignore
export const useGlobalReducer = (initialState: IDefaultGlobalState) => useReducer(reducer, initialState || defaultState);

