import { useContext, createContext, useState } from 'react';
import { ToastTypes } from '../components';

const DEFAULT_TIMEOUT = 5000;

export interface IToastMessageContextType {
    message: string | null;
    title: string | null;
    type: ToastTypes | null;
    makeToast: (props: {
        message: string,
        title: string,
        type: ToastTypes,
        timeOut?: number
    }) => void;
}

const ToastMessageContext = createContext<IToastMessageContextType>({} as IToastMessageContextType);

const { Provider } = ToastMessageContext;

export default function ToastMessageProvider(props: React.PropsWithChildren) { // NOSONAR
    const [message, setMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [type, setType] = useState<ToastTypes | null>(ToastTypes.Info);

    const makeToast = (props: {
        message: string, title: string, type: ToastTypes, timeOut?: number
    }) => {
        const { message, type, title, timeOut = DEFAULT_TIMEOUT } = props;
        setMessage(message);
        setTitle(title || null);
        setType(type);

        // Clear the message after provided time or default time
        setTimeout(() => {
            setMessage(null);
            setTitle(null);
            setType(null);
        }, timeOut);
    };

    return <Provider value={{ message, title, type, makeToast }} {...props} />;
}


const useToastMessageContext = () => useContext(ToastMessageContext);

export { ToastMessageContext, useToastMessageContext };
