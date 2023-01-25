import './ListCard.css';
import { IList } from '../../types';
import { EllipsisMenu } from '../Icons';
import ListCardDropMenu from './CardMenu';
import { formatter, ui } from '../../utils';
import React, { useEffect, useState } from 'react';
import EditableContent, { EditableContentTypes } from '../EditableContent';
import { useNavigate } from 'react-router-dom';

function displayMostRecentDate(createdAt: Date, updatedAt: Date): string {
    const date: Date = updatedAt > createdAt ? updatedAt : createdAt;
    // dd Mon yy format
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
        .format(new Date(date));
}

function DefaultIcon(): JSX.Element {
    return (
        <div className='List-card-default-icon'>
        </div>
    );
}

function preventDefaults(e: React.SyntheticEvent): void {
    if (e?.preventDefault) {
        try {
            e?.preventDefault();
            e?.stopPropagation();
        } catch (error) {
            return;
        }
    }
}

export default function ListCard(props: IList): JSX.Element { //NOSONAR
    const { name, isDefault, createdAt, updatedAt, products, _id }: IList = props;
    const [showDropMenu, setShowDropMenu] = useState<boolean>(false);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const handleRouteChange = useNavigate();

    const numProducts: number = products?.length || 0;

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);


    /**Button/Action handlers  Click Events only*/
    const handleMenuClick = (e?: React.SyntheticEvent): void => {
        preventDefaults(e as React.SyntheticEvent);
        setShowDropMenu(!showDropMenu);
    };

    // Ensures routing only occurs if the card element itself is double clicked
    const handleRouteClick = (e: React.SyntheticEvent): void => {
        preventDefaults(e);
        const target: HTMLElement = e.target as HTMLElement;

        if (!target.hasAttribute('id')//NOSONAR
            && !target.classList.contains('Editable-content')
            && !target.classList.contains('Editable-content-container')
            && !target.classList.contains('List-card-info-span')
            && !target.classList.contains('button-text')
            && !target.classList.contains('List-card-drop-button')
            && !target.classList.contains('Form-label-container')
        ) {
            handleRouteChange(`/list/${_id}`);
        }
    };

    // Ensures the editor only shows if the editable content is double clicked
    const handleShowEditorClick = (e: React.SyntheticEvent): void => {
        preventDefaults(e);

        const target: HTMLElement = e.target as HTMLElement;
        target
            .classList
            .contains('Editable-content') && setShowEditor(true);
    };


    // Enables the editor to close when the user clicks outside of the editable content
    const handleCloseEditor = (e: React.SyntheticEvent): void => {
        preventDefaults(e);

        if (showEditor) {
            const target: HTMLElement = e.target as HTMLElement;
            if (!target.hasAttribute('id') && target.getAttribute('id') !== 'list-name') {
                setShowEditor(false);
            }
        }
    };
    function singleHandlers(e: React.SyntheticEvent): void {
        setShowDropMenu(false);
        handleCloseEditor(e);
    }
    const handleMobileTouch = (e: React.SyntheticEvent): void => {

        function doubleHandlers(e: React.SyntheticEvent): void {
            handleRouteClick(e);
            handleShowEditorClick(e);
            handleCloseEditor(e);
        }

        ui.registerDoubleTap(e as React.TouchEvent, () => doubleHandlers(e));
        ui.registerSingleTap(e as React.TouchEvent, () => singleHandlers(e));
    };

    return isMounted ? (
        <article
            className='List-card'
            onClick={handleCloseEditor}
            onDoubleClick={handleRouteClick}
            onTouchStart={handleMobileTouch}
            onMouseLeave={singleHandlers}
        >

            <header className='List-card-header'>
                <span>
                    {isDefault && <DefaultIcon />}
                    <p>{displayMostRecentDate(createdAt, updatedAt)}</p>
                </span>

                <EllipsisMenu className='List-card-menu-icon' onClick={handleMenuClick} />

                {showDropMenu && (
                    <ListCardDropMenu
                        listId={_id}
                        setShowMenu={setShowDropMenu}
                    />
                )}
            </header>

            <span className='List-card-info-span'>
                {!showEditor ? (
                    <h2
                        onDoubleClick={handleShowEditorClick}
                        className='List-card-name Editable-content'>
                        {formatter.headingNormalizer(name)}
                    </h2>
                ) : (
                    <EditableContent
                        contentType={EditableContentTypes.ListName}
                        listId={_id}
                        setShowEditor={setShowEditor}
                        defaultContent={name}
                    />
                )}
                <p>{numProducts}</p>
            </span>
        </article>
    ) : <></>;
}
