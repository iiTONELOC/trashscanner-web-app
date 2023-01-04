import './Home.css';
import { useRouterContext } from '../../providers';
import logoImage from '../../assets/images/logo.png';


export default function Home(): JSX.Element {
    const { handleRouteChange } = useRouterContext();

    return (
        <section className='Home-container Text-shadow'>
            <header className='Home-header'>
                <h1>WELCOME TO </h1>
                <h1>TRASH<span>SCAN</span></h1>
            </header>

            <div className='Home-main'>
                <strong>Lorem ipsum dolor</strong>
                <p>
                    {/* TO DO: Replace placeholder text */}
                    sit amet consectetur adipisicing elit. Ducimus veniam, quae
                    delectus incidunt voluptatem eligendi, quisquam eius
                    similique quod in quo libero ullam iste placeat! Sapiente
                    dolorum nemo nisi maxime?
                </p>
                <div className='Action-button-container'>
                    <button
                        role={'navigation'}
                        aria-label={'Sign Up'}
                        onClick={() => handleRouteChange('/signup')}
                        className='Action-button Text-shadow'>SIGN UP</button>
                    <button
                        role={'navigation'}
                        aria-label={'Login'}
                        onClick={() => handleRouteChange('/login')}
                        className='Button Text-shadow'>LOGIN</button>
                </div>
            </div>

            <div className='Home-hero'>
                <img alt='TrashScan Logo' src={logoImage} />
            </div>
        </section>
    );
};
