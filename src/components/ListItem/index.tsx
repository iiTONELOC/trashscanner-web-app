import './ListItem.css';
import { IProduct } from '../../types';
import { useDeviceType } from '../../hooks';
import { formatter, ui } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';
import React, { useEffect, useState } from 'react';
import { useLocation, Location } from 'react-router';
import { CheckIcon } from '@heroicons/react/24/solid';
import IncreaseQuantityButton from './IncreaseQuantityButton';
import DecreaseQuantityButton from './DecreaseQuantityButton';
import { getItemFromStorage, setItemIntoStorage } from './helpers';
import EditableContent, { EditableContentTypes } from '../EditableContent';


function RenderItemStatus(props: { itemId: string, listId: string }): JSX.Element { //NOSONAR
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

function RenderCount(props: { count: number, onTouchEnd?: (e: React.TouchEvent) => void }): JSX.Element {
    const showQuantity: boolean = props.count > 1;

    return (
        <p onTouchEnd={props.onTouchEnd}>{showQuantity ? `x ${props.count}` : ' '}</p>
    );
}

export default function ListItem(props: { product: IProduct, duplicateCount?: number }) { //NOSONAR
    const [showEditQuantity, setShowEditQuantity] = useState<boolean>(false);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [listId, setListId] = useState<string | null>(null);
    const { _id, product, alias }: IProduct = props.product;
    const { barcode, name }: IProduct['product'] = product;

    const loc: Location = useLocation();

    const isMobileDevice: boolean = useDeviceType() === 'mobile';

    const productNameToDisplay = (_name: string): string => alias && alias !== ' ' ? alias : _name;
    const nameNotFound = !alias && name
        .toLowerCase()
        .includes('not found');

    useEffect(() => {
        setIsMounted(true);
        // check the os type in the browser
        setListId(loc.pathname.split('/')[2]?.trim());
        return () => setIsMounted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleDoubleClick = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        const target: HTMLElement = e.target as HTMLElement;
        target
            .classList
            .contains('Editable-content') && setShowEditor(true);
    };

    const handleCloseEditor = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (showEditor) {
            const target: HTMLElement = e.target as HTMLElement;
            if (!target.hasAttribute('id')
                && target.getAttribute('id') !== null
                && !target.classList.contains('Editable-content')
                && !target.classList.contains('Form-label-container')
            ) {
                setTimeout(() => setShowEditor(false), 500);
            }
        }
    };

    const handleEditFormMobile = (e: React.TouchEvent): void => ui
        .registerDoubleTap(e, () => handleDoubleClick(e as unknown as React.SyntheticEvent));
    const handleCountMobile = (e: React.TouchEvent): void => ui
        .registerDoubleTap(e, () => setShowEditQuantity(!showEditQuantity));

    const pClass = `List-name-barcode Editable-content ${nameNotFound ? 'Yellow-text' : ''}`;

    return isMounted ? (
        <li className="List-item-product"
            onClick={handleCloseEditor}
            tabIndex={0}                    //NOSONAR           
        >
            <span className='List-product-span'
                onDoubleClick={(e: React.SyntheticEvent) => showEditor && handleCloseEditor(e)}
            >
                <RenderItemStatus itemId={_id} listId={listId || ''} />

                {/* On double click we need to render the editor */}
                {!showEditor ? (
                    <p
                        onDoubleClick={handleDoubleClick}
                        onTouchEnd={handleEditFormMobile}
                        className={pClass}>
                        {formatter.headingNormalizer(productNameToDisplay(name))} - {barcode[0]}
                    </p>
                ) : (
                    <EditableContent
                        contentType={EditableContentTypes.ProductName}
                        productId={_id}
                        listId={listId as string}
                        setShowEditor={setShowEditor}
                        defaultContent={productNameToDisplay(name)}
                    />
                )}
            </span>

            <span
                className='List-product-span-controls'
                onMouseEnter={!isMobileDevice ? () => setShowEditQuantity(true) : undefined}
                onMouseLeave={!isMobileDevice ? () => setShowEditQuantity(false) : undefined}
            >
                <div className='List-count'>
                    <RenderCount
                        onTouchEnd={handleCountMobile}
                        count={props.duplicateCount || 0} />

                    {showEditQuantity && (
                        <div className='List-add-remove-btn-container'>
                            <IncreaseQuantityButton
                                listId={listId as string}
                                barcode={barcode[0]}
                            />

                            <DecreaseQuantityButton
                                currentQuantity={props.duplicateCount || 1}
                                listId={listId as string}
                                productId={_id}
                            />
                        </div>
                    )}
                </div>

                <DoubleEllipsisMenu
                    onClick={() => setShowEditQuantity(!showEditQuantity)}
                    className='List-item-menu-icon'
                />
            </span>
        </li>
    ) : <></>;
}
