import './Footer.css';

const currentYear = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className='Footer'>
            <p className='Footer-text'>Made with ❤️ by Anthony Tropeano © {currentYear} - All rights reserved.</p>
        </footer>
    );
}
