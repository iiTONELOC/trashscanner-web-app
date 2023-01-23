import './LiveUpdateToggler.css';
import { IList, IUpcDb } from '../../types';
import { useEffect, useState } from 'react';
import { SignalIcon, NoSignalIcon } from '../Icons';

export default function LiveUpdateToggler(props: {// NOSONAR
    listId: string;
    db: IUpcDb;
    listSetter: React.Dispatch<React.SetStateAction<IList | null>>;
}): JSX.Element {
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const [updater, setUpdater] = useState<NodeJS.Timeout | null>(null);
    const [isLive, setIsLive] = useState<boolean>(false);

    const toggleLive = () => {
        setIsLive(!isLive);
    };

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            setIsLive(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        if (isLive && isMounted) {
            const refetch = setInterval(() => {
                if (props.listId) {
                    props.db.getList(props.listId).then(res => {
                        const { data } = res;
                        if (data) {
                            props.listSetter(data);
                        }
                    });
                }
            }, 5000);

            setUpdater(refetch);
        }

        if (!isLive && updater && isMounted) {
            clearInterval(updater);
        }

        return () => {
            if (!isLive && updater) {
                clearInterval(updater);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive, isMounted]);


    return isMounted ? (
        <div
            className='Live-update-toggle-container'
            onClick={toggleLive}
        >
            {!isLive ?
                <NoSignalIcon className='Live-control-icon Live-control-icon-off' /> :
                <SignalIcon className='Live-control-icon Live-control-icon-live' />
            }

        </div>
    ) : <></>;
}
