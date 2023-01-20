import './ListItem.css';
import { IProduct } from '../../types';
import { formatter, ui } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';
import React, { useEffect, useState } from 'react';
import IncreaseQuantityButton from './IncreaseQuantityButton';
import DecreaseQuantityButton from './DecreaseQuantityButton';
import EditableContent, { EditableContentTypes } from '../EditableContent';

function RenderListStatus(): JSX.Element {
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const handleClick = (): void => {
        setIsCompleted(!isCompleted);
    };

    return (
        <div className={isCompleted ? 'List-item-status completed' : 'List-item-status'}
            onClick={handleClick}>
        </div>
    );
}

function RenderCount(props: { count: number, onTouchEnd?: (e: React.TouchEvent) => void }): JSX.Element {
    const showQuantity: boolean = props.count > 1;
    return (
        <p onTouchEnd={props.onTouchEnd}>{showQuantity ? `x ${props.count}` : ' '}</p>
    );
}

export default function ListItem(props: { product: IProduct, duplicateCount?: number }) { //NOSONAR
    const [isQuantityHovered, setIsQuantityHovered] = useState<boolean>(false);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [listId, setListId] = useState<string | null>(null);
    const { _id, product, alias }: IProduct = props.product;
    const { barcode, name }: IProduct['product'] = product;

    const productNameToDisplay = (_name: string): string => alias && alias !== ' ' ? alias : _name;

    useEffect(() => {
        setIsMounted(true);
        setListId(window.location.pathname.split('/')[2]?.trim());
        return () => setIsMounted(false);
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
            if (!target.hasAttribute('id') && target.getAttribute('id') !== 'list-name') {
                setTimeout(() => setShowEditor(false), 500);
            }
        }
    };

    const handleEditFormMobile = (e: React.TouchEvent): void => ui
        .registerDoubleTap(e, () => handleDoubleClick(e as unknown as React.SyntheticEvent));
    const handleCountMobile = (e: React.TouchEvent): void => ui
        .registerDoubleTap(e, () => setIsQuantityHovered(!isQuantityHovered));

    return isMounted ? (
        <li className="List-item-product"
            onClick={handleCloseEditor}
        >
            <span className='List-product-span'

                onDoubleClick={() => showEditor && setShowEditor(false)}
            >
                <RenderListStatus />
                {/* On double click we need to render the editor */}
                {!showEditor ? (
                    <p
                        onDoubleClick={handleDoubleClick}
                        onTouchEnd={handleEditFormMobile}
                        className='List-name-barcode Editable-content'>
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

            <span className='List-product-span-controls'
                onMouseEnter={() => setIsQuantityHovered(true)}
                onMouseLeave={() => setIsQuantityHovered(false)}
            >
                <div className='List-count'>
                    <RenderCount
                        onTouchEnd={handleCountMobile}
                        count={props.duplicateCount || 1} />

                    {isQuantityHovered && (
                        <div
                            className='List-add-remove-btn-container'>

                            <IncreaseQuantityButton
                                listId={listId as string}
                                barcode={barcode[0]}
                            />
                            <DecreaseQuantityButton listId={listId as string} productId={_id} />
                        </div>
                    )}
                </div>

                <DoubleEllipsisMenu
                    className='List-item-menu-icon'
                />
            </span>
        </li>
    ) : <></>;
}
