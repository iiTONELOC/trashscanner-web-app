import { IList, IProduct } from '../../types';
import reducerActions from './storeActions';
import { useGlobalReducer } from './storeReducer';

import { useContext, createContext, Dispatch } from 'react';
interface IAction<T> {
    type: string;
    payload: T;
}

interface IPayloads {
    lists?: IList[];
    list?: IList;
    product?: IProduct;
}

interface GlobalStoreContextType {
    globalState: {
        lists: {
            [key: string]: IList;
        };
    }
    dispatch: Dispatch<IAction<IPayloads>>;
}

const GlobalStoreContext = createContext<GlobalStoreContextType>({} as GlobalStoreContextType);

const { Provider } = GlobalStoreContext;

export default function GlobalStoreProvider(props: React.PropsWithChildren) { // NOSONAR
    const [globalState, dispatch] = useGlobalReducer({ lists: {} });

    return <Provider value={{ globalState, dispatch }} {...props} />;
};

const useGlobalStoreContext = () => useContext(GlobalStoreContext);

export { GlobalStoreContext, useGlobalStoreContext, reducerActions };
