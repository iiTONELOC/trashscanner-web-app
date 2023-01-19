import './ListItem.css';
import React, { useState } from 'react';
import { IProduct } from '../../types';
import { formatter } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';
import IncreaseQuantityButton from './IncreaseQuantityButton';
import DecreaseQuantityButton from './DecreaseQuantityButton';
import EditableContent, { EditableContentTypes } from '../EditableContent';

function RenderListStatus(): JSX.Element {
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const handleClick = () => {
        // TODO: Update the product status in the database
        setIsCompleted(!isCompleted);
    };

    return (
        <div className={isCompleted ? 'List-item-status completed' : 'List-item-status'}
            onClick={handleClick}>
        </div>
    );
}

function RenderCount(props: { count: number, onTouchEnd?: (e: React.TouchEvent) => void }): JSX.Element {
    const showQuantity = props.count > 1;
    return (
        <p onTouchEnd={props.onTouchEnd}>{showQuantity ? `x ${props.count}` : ' '}</p>
    );
}

export default function ListItem(props: { product: IProduct, duplicateCount?: number }) {
    const [isQuantityHovered, setIsQuantityHovered] = useState<boolean>(false);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const { _id, barcode, name } = props.product;

    // get the default list id from the url
    const listId = window.location.pathname.split('/')[2];

    const registerDoubleTap = (e: React.TouchEvent, callback: () => void) => {
        const time = new Date().getTime();
        const delta = time - (e.currentTarget as any).lastTouch || 0;
        const delay = 300;
        if (delta < delay && delta > 0) {
            callback();
        }
        (e.currentTarget as any).lastTouch = time;
    };


    return (
        <li className="List-item-product">

            <span className='List-product-span'>
                <RenderListStatus />
                {/* On double click we need to render the editor */}
                {!showEditor ? (
                    <p
                        onDoubleClick={() => setShowEditor(true)}
                        onTouchEnd={(e: React.TouchEvent) => registerDoubleTap(e, () => setShowEditor(true))}
                        className='List-name-barcode Editable-content'>
                        {formatter.headingNormalizer(name)} - {barcode[0]}
                    </p>
                ) : (
                    <EditableContent
                        contentType={EditableContentTypes.ProductName}
                        defaultContent={name}
                    />
                )}
            </span>

            <span className='List-product-span-controls'
                onMouseEnter={() => setIsQuantityHovered(true)}
                onMouseLeave={() => setIsQuantityHovered(false)}
            >
                <div className='List-count'>
                    <RenderCount
                        onTouchEnd={(e: React.TouchEvent) => registerDoubleTap(e, () => setIsQuantityHovered(!isQuantityHovered))}
                        count={props.duplicateCount || 1} />

                    {isQuantityHovered && (
                        <div
                            className='List-add-remove-btn-container'>

                            <IncreaseQuantityButton
                                listId={listId}
                                barcode={barcode[0]}
                            />
                            <DecreaseQuantityButton listId={listId} productId={_id} />
                        </div>
                    )}
                </div>

                <DoubleEllipsisMenu
                    className='List-item-menu-icon'
                />
            </span>
        </li>
    );
}
