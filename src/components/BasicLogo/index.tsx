import './BasicLogo.css';
import { useRouterContext } from '../../providers';

export default function BasicLogo() {
    const { handleRouteChange } = useRouterContext();
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
