import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { getItemFromStorage, setItemIntoStorage } from '../helpers';

export default function ItemStatus(props: { itemId: string, listId: string }): JSX.Element { //NOSONAR
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const handleClick = (): void => {
        // update state
        setIsCompleted(!isCompleted);

        // get the item from local storage
        const item = getItemFromStorage(props.listId, props.itemId);

        // set the completed property to the opposite of what it is
        item.completed = !isCompleted;

        // put the item back into local storage
        setItemIntoStorage(props.listId, props.itemId, item);
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
            // look for the item in local storage
            const itemObj = getItemFromStorage(props.listId, props.itemId);

            // look and see if the item has a completed property
            if (itemObj.completed) {
                // if it does, set the state to match
                setIsCompleted(itemObj.completed);
            } else {
                // if it doesn't, ensure our state is false and set the property for future use
                setIsCompleted(false);
                itemObj['completed'] = false;
            }

            setItemIntoStorage(props.listId, props.itemId, itemObj);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    const divClass = isCompleted ? 'List-item-status List-item-status-completed' : 'List-item-status';
    const iconClass = isCompleted ? 'List-item-status-icon List-item-status-icon-completed' : 'List-item-status-icon';

    return isMounted ? (
        <div className={divClass}
            onClick={handleClick}>
            {isCompleted && <CheckIcon className={iconClass} />}
        </div>
    ) : <></>;
}