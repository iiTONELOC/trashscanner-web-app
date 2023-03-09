import './Home.css';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/logo.png';
import { IUserContextType, useUserContext } from '../../providers';

export default function Home(): JSX.Element {

    const { isAuthenticated }: IUserContextType = useUserContext();

    return (
        <section className='Home-container Text-shadow'>
            <header className='Home-header'>
                <h1>WELCOME TO </h1>
                <h1>TRASH<span>SCAN&#8482;</span></h1>
            </header>

            <div className='Home-main'>
                <h2><strong><em>The App</em></strong></h2>
                <br />
                <p>
                    Tired of going to the store for that
                    <span className='Green-text'> one item </span>
                    only to return with
                    <span className='Green-text'> everything but</span>?
                </p>

                <p>Now you don't have to!</p>

                <p>
                    Use <span className='Blue-text'> TrashScan&#8482;</span>
                    <em>The Device</em> to scan the barcodes of your discarded items where they are added to
                    your default product list. Then, when you're ready to go shopping, simply open the
                    <span className='Green-text'> TrashScan&#8482;</span> app and your list will be ready to go!
                </p>

                <p>
                    Don't have <span className='Blue-text'>TrashScan&#8482;</span>
                    <em>The Device</em>? Not a problem!
                    <span className='Green-text'> TrashScan&#8482;
                    </span><em>The App</em> will allow you to manually add items to your shopping list
                    using your device's camera!
                </p>
                {!isAuthenticated && <div className='Action-button-container'>
                    <Link
                        to={'/signup'}
                        aria-label={'Sign Up'}
                        className='Action-button Text-shadow'>SIGN UP
                    </Link>
                    <Link
                        to={'/login'}
                        aria-label={'Login'}
                        className='Button Text-shadow'>LOGIN
                    </Link>
                </div>}
            </div>

            <div className='Home-hero'>
                <img alt='TrashScan Logo' src={logoImage} />
            </div>
        </section>
    );
};
