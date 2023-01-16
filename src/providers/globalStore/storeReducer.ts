import { useReducer } from 'react';
import { IList, IProduct } from '../../types';
import {
    SET_LISTS, ADD_TO_LIST, UPDATE_LIST,
    DELETE_LIST, REMOVE_FROM_LIST
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
    product?: IProduct;
}

export const reducer = (state: IDefaultGlobalState, action: IAction<IPayloads>) => {
    switch (action.type) {
        case SET_LISTS:
            return {
                ...state,
                lists: action.payload.lists?.map(l => ({ [l._id]: l }))
                    .reduce((acc, cur) => ({ ...acc, ...cur }), {})
            };
        case ADD_TO_LIST:
            const id = action?.payload?.list?._id;
            if (!id) {
                return state;
            }
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [id]: action.payload.list
                }
            };
        case UPDATE_LIST:
            const listId = action?.payload?.list?._id;
            if (!listId) {
                return state;
            }
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: action.payload.list
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
        case REMOVE_FROM_LIST:
            const listIdToRemoveFrom = action?.payload?.list?._id;
            const productToRemove = action?.payload?.product;
            if (!listIdToRemoveFrom || !productToRemove) {
                return state;
            }
            const list = state.lists[listIdToRemoveFrom];
            const products = list.products.filter(p => p._id !== productToRemove._id);
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listIdToRemoveFrom]: {
                        ...list,
                        products
                    }
                }
            };
        default:
            return state;
    }
};

const defaultState: IDefaultGlobalState = { lists: {} };
// @ts-ignore
export const useGlobalReducer = (initialState: IDefaultGlobalState) => useReducer(reducer, initialState || defaultState);

