import logoImg from '../assets/logo_envelope.png';

export default function Header() {
    return (
        <header id='main-header'>
            <img src={logoImg} alt='A open envelope with a heart inside' />
            <h1>A hundred envelopes</h1>
        </header>
    );
}