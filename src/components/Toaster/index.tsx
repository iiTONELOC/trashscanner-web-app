import Portal from '../Portal';
import { useEffect, useState } from 'react';
import Toast, { ToastTypes } from '../Toast';
import { IToastMessageContextType } from '../../types';
import { useToastMessageContext } from '../../providers';


export default function Toaster(): JSX.Element {//  NOSONAR
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);

    const { message, type, title }: IToastMessageContextType = useToastMessageContext();

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {

        if (isMounted && message && type) {
            setShowToast(true);
        } else {
            setShowToast(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, type]);


    return isMounted && showToast ? (
        <Portal>
            <Toast
                message={message || 'This is a notification message'}
                type={type || ToastTypes.Info}
                title={title || ''}
                onClose={() => setShowToast(false)}
            />
        </Portal>
    ) : <></>;
}
