import './LiveUpdateToggler.css';
import { IList } from '../../types';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SignalIcon, NoSignalIcon } from '../Icons';
import { GET_LIST } from '../../utils/graphQL/queries';




export default function LiveUpdateToggler(props: {// NOSONAR
    listId: string;
    listSetter: React.Dispatch<React.SetStateAction<IList | null>>;
    isLive: boolean;
    setIsLive: React.Dispatch<React.SetStateAction<boolean>>;
    toggleLive: () => void;
}): JSX.Element {
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const [updater, setUpdater] = useState<NodeJS.Timeout | null>(null);

    const { isLive, setIsLive, toggleLive } = props;

    const { refetch } = useQuery(GET_LIST, {
        variables: {
            listId: props.listId
        }
    });


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
            const _refetch = setInterval(async () => {
                if (props.listId) {
                    const { data } = await refetch({ listId: props.listId });
                    // props.db.getList(props.listId).then(res => {
                    //     const { data } = res;
                    //     if (data) {
                    //         props.listSetter(data);
                    //     }
                    // });
                }
            }, 5000);

            setUpdater(_refetch);
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
