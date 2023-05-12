import './ListItem.css';
import { IListItem } from '../../types';
import { formatter, ui } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';
import { useLocation, Location } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import EditableContent, { EditableContentTypes } from '../EditableContent';
import { useDeviceType, useSwipe, ISwipeConfig, IUseSwipe, Direction, DirectionInfo } from '../../hooks';
import {
    ItemCount, ItemStatus, DecreaseQuantityButton,
    IncreaseQuantityButton, AddOneOnSwipeRight, SwipeLeft
} from './ListItemComponents';

// used in multiple places to determine if the target element is editable
const EDITABLE_CONTENT = 'Editable-content';

// The class names of the Elements that are swipe-able within the list item component
const acceptableClasses: string[] = [
    'List-count',
    'List-item-product',
    'List-product-span',
    'List-item-menu-icon',
    'List-product-span-controls',
    'List-add-remove-btn-container',
    'List-item-swipe-container',
    EDITABLE_CONTENT
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

export default function ListItem(props: {
    listItemId: string,
    product: IListItem,
    duplicateCount?: number
}) { //NOSONAR
    const [justifySwipeContent, setJustifySwipeContent] = useState<SwipeJustifications>(SwipeJustifications.None);
    const [swipeDirection, setSwipeDirection] = useState<Direction>(Direction.None);
    const [showEditQuantity, setShowEditQuantity] = useState<boolean>(false);
    const [visibleSwipeWidth, setVisibleSwipeWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(-1);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [listId, setListId] = useState<string | null>(null);
    const [swipeXDiff, setSwipeXDiff] = useState<number>(0);
    const [reset, setReset] = useState<boolean>(false);


    const { handleTouchMove, handleTouchStart, handleTouchEnd }: IUseSwipe = useSwipe(swipeConfig);
    const isMobileDevice: boolean = useDeviceType() === 'mobile';
    const { _id, productData, productAlias } = props.product.product;
    const { barcode, name } = productData;
    const loc: Location = useLocation();

    // displays the product name or the alias if it exists
    const productNameToDisplay = (_name: string): string => productAlias && productAlias !== ' ' ? productAlias : _name;

    // Determines if the product name is not found
    const nameNotFound = !productAlias && name
        .toLowerCase()
        .includes('not found');

    // Highlights the product name and barcode if the product name is not found
    const pClass = `List-name-barcode Editable-content ${nameNotFound ? 'Yellow-text' : ''}`;

    // _______ Component Helper Functions _______

    // double click handler for editing the product name - barcode isn't editable
    const handleShowEditorOnDblClick = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        const target: HTMLElement = e.target as HTMLElement;
        target
            .classList
            .contains(EDITABLE_CONTENT) && setShowEditor(true);
    };

    // Handles the closing of the editor
    const handleCloseEditor = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (showEditor) {
            const target: HTMLElement = e.target as HTMLElement;
            if (!target.hasAttribute('id')
                && target.getAttribute('id') !== null
                && !target.classList.contains(EDITABLE_CONTENT)
                && !target.classList.contains('Form-label-container')
            ) {
                setTimeout(() => setShowEditor(false), 500);
            }
        }
    };

    // Wrapper. Allows for an optional reset of the swipe direction &
    // Swipe state. If the state is reset, the UI will not display the
    // action buttons.
    // Then calls the original handleTouchEnd function
    const _handleTouchEnd = (e: React.TouchEvent): void => {
        if (reset || swipeDirection === Direction.None) {
            setJustifySwipeContent(SwipeJustifications.None);
            setSwipeXDiff(0);
            setVisibleSwipeWidth(0);
            setContainerHeight(-1);
            setReset(false);
        }

        handleTouchEnd(e);
    };

    const handleContainerHeight = (): void => {
        const listItemHeight: number = document.querySelector(`[data-product-id="${_id}"]`)?.clientHeight || 0;
        setContainerHeight(listItemHeight);
    };

    // Wrapper. Resets the swipe direction so we don't get a false positive
    // Then calls the original handleTouchStart function
    const _handleTouchStart = (e: React.TouchEvent): void => {
        // get the element with the data-product-id attribute

        handleContainerHeight();
        setSwipeDirection(Direction.None);
        handleTouchStart(e);
    };

    // Allows for the user to edit the product name on a mobile device
    // This registers a double tap on the product details
    const handleEditFormMobile = (e: React.TouchEvent): void => ui
        .registerDoubleTap(e, () => handleShowEditorOnDblClick(e as unknown as React.SyntheticEvent));

    // Provides swipe actions on touch devices
    const handleSwipeMovement = (e: React.TouchEvent): void => {
        const { direction, xDiff, speed }: DirectionInfo = handleTouchMove(e);
        const _speed: number = speed || 0;

        // must swipe at least 75px and at a speed of 700ms to trigger the swipe action
        const triggerSpeed = 700;
        const triggerMovePx = 75;

        // update our state values tracking the swipe direction and the xDiff
        setSwipeDirection(direction);
        setSwipeXDiff(xDiff);
        handleContainerHeight();

        // If left and the swipe is greater than 75px
        if (visibleSwipeWidth > triggerMovePx && swipeDirection === Direction.Left) {
            const deleteAllButton: HTMLElement | null = document.querySelector(`[data-delete-one-id="${_id}"]`);
            // check the speed
            _speed > triggerSpeed && (() => {
                deleteAllButton?.click();
                setReset(true);
                _handleTouchEnd(e as unknown as React.TouchEvent);
            })();
        }

        // Right swipe
        if (visibleSwipeWidth > triggerMovePx && swipeDirection === Direction.Right) {
            const addOneButton: HTMLElement | null = document.querySelector(`[data-add-one-id="${_id}"]`);
            // check the speed
            _speed > triggerSpeed && (() => {
                addOneButton?.click();
                setReset(true);
                _handleTouchEnd(e as unknown as React.TouchEvent);
            })();
        }
    };

    // Adjusts the width of swipe-able action (add 1 or delete 1)
    const adjustSwipeContentWidth = ({ swipeXDiff }: { swipeXDiff: number }) => {
        const movingEl: HTMLElement | null = document.querySelector(`[data-product-id="${_id}"]`);

        if (movingEl) {
            const elWidth: number = movingEl.offsetWidth;

            // figure percentage moved based on the swipeXDiff and our elWidth
            const widthPercentageMoved: number = swipeXDiff / elWidth;
            const swipeDeleteContainer: HTMLElement | null = document.querySelector(`[data-swipe-id="${_id}"]`);

            if (swipeDeleteContainer) {
                // set the width of the Swipe-delete-container
                const currentWidth = Math.ceil(Math.abs(widthPercentageMoved) * 100);
                setVisibleSwipeWidth(currentWidth);
            }
        }
    };

    // _______ Component Effects _______
    useEffect(() => {
        setIsMounted(true);
        // check the os type in the browser
        setListId(loc.pathname.split('/')[2]?.trim());
        return () => setIsMounted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // updates the width of the swipe content based on the swipe direction and swipe xDiff
    useMemo(() => {
        adjustSwipeContentWidth({ swipeXDiff });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [swipeXDiff]);

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


    return isMounted ? (
        <li className={`List-item-swipe-container ${justifySwipeContent}`} style={{
            height: containerHeight === -1 ? 'auto' : `${containerHeight}px`,
        }}>
            {/* Add one on swipe right */}
            {swipeDirection === Direction.Right &&
                <AddOneOnSwipeRight
                    _id={_id}
                    width={visibleSwipeWidth}
                    listId={listId as string}
                    barcode={barcode[0]} />
            }

            {/* LIST ITEM START */}
            <section className="List-item-product"
                onTouchStart={_handleTouchStart}
                onTouchMove={handleSwipeMovement}
                onTouchEnd={_handleTouchEnd}
                onClick={handleCloseEditor}
                data-product-id={_id}
                tabIndex={0}
            >
                <span className='List-product-span'
                    onDoubleClick={(e: React.SyntheticEvent) => showEditor && handleCloseEditor(e)}
                >
                    <ItemStatus itemId={_id} />

                    {/* On double click we need to render the editor */}
                    {!showEditor ? (
                        <>
                            <p
                                onDoubleClick={handleShowEditorOnDblClick}
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
                                count={props.product.quantity || 0} />
                            {/* This only should be visible on desktop devices */}
                            {showEditQuantity && !isMobileDevice && (
                                <div className='List-add-remove-btn-container'>
                                    <IncreaseQuantityButton
                                        listId={listId as string}
                                        barcode={barcode[0]}
                                    />

                                    <DecreaseQuantityButton
                                        currentQuantity={props.product.quantity || 1}
                                        listId={listId as string}
                                        listItemId={props.listItemId}
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
            {swipeDirection === Direction.Left &&
                <SwipeLeft
                    _id={_id}
                    listId={listId as string}
                    currentQuantity={props.product.quantity || 1}
                    width={visibleSwipeWidth} />
            }
        </li>
    ) : <></>;
}
