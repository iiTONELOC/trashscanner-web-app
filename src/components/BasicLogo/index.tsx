import './BasicLogo.css';

import { useNavigate } from 'react-router-dom';

export default function BasicLogo() {
    const handleRouteChange = useNavigate();
    return (
        <div className='Basic-logo'
            tabIndex={0}
            role={'link'}
            aria-label={'link - home'}
            onClick={() => handleRouteChange('/')}
        >
            <p>
                T<span>S</span>
            </p>
        </div>
    );
}
