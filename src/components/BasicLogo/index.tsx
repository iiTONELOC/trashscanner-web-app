import './BasicLogo.css';
import { IRouterContextType, useRouterContext } from '../../providers';

export default function BasicLogo() {
    const { handleRouteChange }: IRouterContextType = useRouterContext();
    return (
        <div className='Basic-logo'
            onClick={() => handleRouteChange('/')}
        >
            <p>
                T<span>S</span>
            </p>
        </div>
    );
}
