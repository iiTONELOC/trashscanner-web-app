import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

import { useMutation } from '@apollo/client';
import { UPDATE_LIST_ITEM } from '../../../utils/graphQL/mutations';


export default function ItemStatus(props: { itemId: string }): JSX.Element { //NOSONAR
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const [updateListItem] = useMutation(UPDATE_LIST_ITEM);

    const handleClick = (): void => {
        // update state
        setIsCompleted(!isCompleted);
    };

    useEffect(() => {
        setIsMounted(true);
        return (): void => {
            setIsMounted(false);
        };
    }, []);

    useEffect(() => {
        // Updates the completed status of the item on component mount
        if (isMounted) {
            (async () => {
                await updateListItem({
                    variables: {
                        listItemId: props.itemId,
                        isCompleted
                    }
                });
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCompleted]);

    const divClass = isCompleted ? 'List-item-status List-item-status-completed' : 'List-item-status';
    const iconClass = isCompleted ? 'List-item-status-icon List-item-status-icon-completed' : 'List-item-status-icon';

    return isMounted ? (
        <div className={divClass}
            onClick={handleClick}>
            {isCompleted && <CheckIcon className={iconClass} />}
        </div>
    ) : <></>;
}