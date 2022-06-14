import { Link } from 'react-router-dom';
import { NavbarContainerStyling } from './navbarStyles';

const Navbar = () => {
    return (
        <NavbarContainerStyling data-component="navbar">
            <ul>
                <li><Link to="/home" data-navbar-button="home">Home</Link></li>
                <li><input type="button" value="A" data-create-item-button="board" /></li>
            </ul>
        </NavbarContainerStyling>
    )
};

export default Navbar;