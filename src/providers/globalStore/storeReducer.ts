import { useReducer } from 'react';
import { IList, IProduct } from '../../types';
import {
    SET_LISTS, ADD_TO_LIST, UPDATE_LIST,
    DELETE_LIST, ADD_NEW_LIST
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
    const listId = action?.payload?.list?._id;
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

        case ADD_NEW_LIST:
        case UPDATE_LIST:
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
        default:
            return state;
    }
};

const defaultState: IDefaultGlobalState = { lists: {} };
// @ts-ignore
export const useGlobalReducer = (initialState: IDefaultGlobalState) => useReducer(reducer, initialState || defaultState);

