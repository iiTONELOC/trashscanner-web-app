import './BasicLogo.css';
import { IRouterContextType, useRouterContext } from '../../providers';

export default function BasicLogo() {
    const { handleRouteChange }: IRouterContextType = useRouterContext();
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
