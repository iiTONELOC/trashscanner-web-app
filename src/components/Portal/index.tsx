import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Portal(props: { children?: JSX.Element }): JSX.Element { //NOSONAR
    const portalRootEl: HTMLElement | null = document.getElementById('portal-root');
    const portalEl: HTMLDivElement = document.createElement('div');

    portalEl.classList.add('Portal');

    //@ts-ignore
    useEffect(() => {
        portalRootEl?.appendChild(portalEl);
        return () => portalRootEl?.removeChild(portalEl);
    }, [portalEl, portalRootEl]);

    return ReactDOM.createPortal(props?.children, portalEl);
}
