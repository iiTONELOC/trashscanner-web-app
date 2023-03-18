import './ListItem.css';
import { IProduct } from '../../types';
import { formatter, ui } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';
import { useLocation, Location } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import EditableContent, { EditableContentTypes } from '../EditableContent';
import { useDeviceType, useSwipe, ISwipeConfig, Direction, DirectionInfo } from '../../hooks';
import {
    ItemCount, ItemStatus, DecreaseQuantityButton, IncreaseQuantityButton,
    AddOneOnSwipeRight, SwipeLeft, DeleteOne
} from './ListItemComponents';


// The class names of the Elements that are swipe-able within the list item component
const acceptableClasses: string[] = [
    'List-count',
    'List-item-product',
    'List-product-span',
    'List-item-menu-icon',
    'List-product-span-controls',
    'List-add-remove-btn-container',
    'List-item-swipe-container'
];

// The configuration for the swipe hook
const swipeConfig: ISwipeConfig = {
    acceptableClasses,
    swipeDirection: 'horizontal'
};

// The possible CSS Classes for the swipe content depending on the direction of the swipe
enum SwipeJustifications {
    None = 'Swipe-justify-none',
    Left = 'Swipe-justify-left',
    Right = 'Swipe-justify-right'
}

export default function ListItem(props: { product: IProduct, duplicateCount?: number }) { //NOSONAR
    const [justifySwipeContent, setJustifySwipeContent] = useState<SwipeJustifications>(SwipeJustifications.None);
    const { handleTouchMove, handleTouchStart, handleTouchEnd } = useSwipe(swipeConfig);
    const [swipeDirection, setSwipeDirection] = useState<Direction>(Direction.None);
    const [showEditQuantity, setShowEditQuantity] = useState<boolean>(false);
    const [visibleSwipeWidth, setVisibleSwipeWidth] = useState<number>(0);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [listId, setListId] = useState<string | null>(null);
    const [swipeXDiff, setSwipeXDiff] = useState<number>(0);

    const { _id, product, alias }: IProduct = props.product;
    const { barcode, name }: IProduct['product'] = product;

    // Hash router
    const loc: Location = useLocation();

    // Actual device type rather than screen size
    const isMobileDevice: boolean = useDeviceType() === 'mobile';

    // displays the product name or the alias if it exists
    const productNameToDisplay = (_name: string): string => alias && alias !== ' ' ? alias : _name;

    // Determines if the product name is not found
    const nameNotFound = !alias && name
        .toLowerCase()
        .includes('not found');

    // Highlights the product name and barcode if the product name is not found
    const pClass = `List-name-barcode Editable-content ${nameNotFound ? 'Yellow-text' : ''}`;

    // double click handler for editing the product name - barcode isn't editable
    const handleDoubleClick = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        const target: HTMLElement = e.target as HTMLElement;
        target
            .classList
            .contains('Editable-content') && setShowEditor(true);
    };

    // Handles the closing of the editor
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

    // Allows for the user to edit the product name and barcode on a mobile device
    // This registers a double tap on the product name and barcode
    const handleEditFormMobile = (e: React.TouchEvent): void => ui
        .registerDoubleTap(e, () => handleDoubleClick(e as unknown as React.SyntheticEvent));

    // Allows for the user to edit the product quantity on a mobile device
    // const handleCountMobile = (e: React.TouchEvent): void => ui
    //     .registerDoubleTap(e, () => setShowEditQuantity(!showEditQuantity));


    // Provides swipe actions on touch devices
    const handleSwipeMovement = (e: React.TouchEvent): void => {
        const { direction, xDiff }: DirectionInfo = handleTouchMove(e);

        // update our state values tracking the swipe direction and the xDiff
        setSwipeDirection(direction);
        setSwipeXDiff(xDiff);
    };

    // Resets the touched element when released
    const _handleTouchEnd = (e: React.TouchEvent): void => {
        //reset remaining settings on swipe right only
        const isLeftSwipe = swipeDirection === Direction.Left && visibleSwipeWidth > 125;

        if (swipeDirection === Direction.Right || isLeftSwipe) {
            setJustifySwipeContent(SwipeJustifications.None);
            setSwipeXDiff(0);
            setVisibleSwipeWidth(0);
            setSwipeDirection(Direction.None);
        }

        handleTouchEnd(e);
    };


    // Adjusts the width of swipe-able action (add 1 or delete all)
    function adjustSwipeContentWidth({ swipeDirection, swipeXDiff }:
        { swipeDirection: Direction, swipeXDiff: number }) {


        // get the element by the _id 
        const el: HTMLElement | null = document.querySelector(`[data-product-id="${_id}"]`);

        if (el) {
            // console log the rendering width of the html element
            const elWidth: number = el.offsetWidth;

            // figure percentage moved based on the swipeXDiff and our elWidth
            const widthPercentageMoved: number = swipeXDiff / elWidth;

            const swipeDeleteContainer: HTMLElement | null = document.querySelector(`[data-swipe-id="${_id}"]`);
            if (swipeDeleteContainer) {
                // set the width of the Swipe-delete-container
                const currentWidth = Math.ceil(Math.abs(widthPercentageMoved) * 100);
                setVisibleSwipeWidth(currentWidth);
            }
        }
    }

    const _handleTouchMove = (e: React.TouchEvent): void => {
        const currentWidth = visibleSwipeWidth;

        if (currentWidth > 125 && swipeDirection === Direction.Left) {
            // click the delete all button
            const deleteAllButton: HTMLElement | null = document.querySelector(`[data-delete-all-id="${_id}"]`);
            deleteAllButton?.click();

            _handleTouchEnd(e as unknown as React.TouchEvent);

            // TODO: DISPLAY A TOAST MESSAGE
        }

        else if (currentWidth > 110 && swipeDirection === Direction.Right) {
            // click the add 1 button
            const addOneButton: HTMLElement | null = document.querySelector(`[data-add-one-id="${_id}"]`);
            addOneButton?.click();
            _handleTouchEnd(e as unknown as React.TouchEvent);
        }

        else {
            handleSwipeMovement(e);
        }
    };



    useEffect(() => {
        setIsMounted(true);
        // check the os type in the browser
        setListId(loc.pathname.split('/')[2]?.trim());
        return () => setIsMounted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // updates direction of swipe
    useMemo(() => {
        if (isMounted) {
            if (swipeDirection === Direction.Left) {
                setJustifySwipeContent(SwipeJustifications.Left);
            } else if (swipeDirection === Direction.Right) {
                setJustifySwipeContent(SwipeJustifications.Right);
            } else {
                setJustifySwipeContent(SwipeJustifications.None);
            }
        }
    }, [isMounted, swipeDirection]);

    // updates the width of the swipe content based on the swipe direction and swipe xDiff
    useMemo(() => {
        adjustSwipeContentWidth({ swipeDirection, swipeXDiff });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [swipeDirection, swipeXDiff]);



    return isMounted ? (
        <li className={`List-item-swipe-container ${justifySwipeContent}`}>
            {/* Add one on swipe right */}
            {Direction.Right === swipeDirection &&
                <AddOneOnSwipeRight
                    _id={_id}
                    width={visibleSwipeWidth}
                    listId={listId as string}
                    barcode={props.product.product.barcode[0]} />
            }

            {/* LIST ITEM START */}
            <section className="List-item-product"
                onTouchStart={handleTouchStart}
                onTouchMove={_handleTouchMove}
                onTouchEnd={_handleTouchEnd}
                onClick={handleCloseEditor}
                data-product-id={_id}
                tabIndex={0}
            >
                <span className='List-product-span'
                    onDoubleClick={(e: React.SyntheticEvent) => showEditor && handleCloseEditor(e)}
                >
                    <ItemStatus itemId={_id} listId={listId || ''} />

                    {/* On double click we need to render the editor */}
                    {!showEditor ? (
                        <>
                            <p
                                onDoubleClick={handleDoubleClick}
                                onTouchEnd={handleEditFormMobile}
                                className={pClass}>
                                {formatter.headingNormalizer(productNameToDisplay(name))} - {barcode[0]}
                            </p>
                        </>
                    ) : (
                        <EditableContent
                            contentType={EditableContentTypes.ProductName}
                            productId={_id}
                            listId={listId as string}
                            setShowEditor={setShowEditor}
                            defaultContent={productNameToDisplay(name)}
                        />
                    )}

                    <span
                        className='List-product-span-controls'
                        onMouseLeave={!isMobileDevice ? () => setShowEditQuantity(false) : undefined}
                    >
                        <div className='List-count'>
                            <ItemCount
                                // onTouchEnd={handleCountMobile}
                                count={props.duplicateCount || 0} />
                            {/* This only should be visible on desktop devices */}
                            {showEditQuantity && !isMobileDevice && (
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
                    </span>

                    {!isMobileDevice && (
                        <DoubleEllipsisMenu
                            onClick={() => setShowEditQuantity(!showEditQuantity)}
                            className='List-item-menu-icon'
                        />
                    )}
                </span>
            </section>
            {/* END LIST ITEM */}

            {/* Delete all on swipe left */}
            {Direction.Left === swipeDirection &&
                <SwipeLeft
                    _id={_id}
                    listId={listId as string}
                    currentQuantity={props.duplicateCount || 1}
                    width={visibleSwipeWidth} />
            }
        </li>
    ) : <></>;
}
