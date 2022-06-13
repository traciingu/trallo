import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <nav data-component="navbar">
            <ul>
                <li><Link to="/home" data-navbar-button="home">Home</Link></li>
                <li><input value="" data-create-item-button="board"/></li>
            </ul>
        </nav>
    )
};

export default Navbar;