import './BasicLogo.css';

export default function BasicLogo() {
    return (
        <div className='Basic-logo'
            onClick={() => window.location.href = '/'}
        >
            <p>
                T<span>S</span>
            </p>
        </div>
    );
}
