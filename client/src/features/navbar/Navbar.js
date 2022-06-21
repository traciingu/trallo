import { NavLink } from 'react-router-dom';
import { NavbarContainerStyling } from './navbarStyles';
import { connect } from 'react-redux';
import { setModalDisplay } from '../board/boardSlice';
import CreateModal from '../modal/CreateModal';

const Navbar = ({ setModalDisplay }) => {
    const handleClick = (e) => {
        setModalDisplay({ isDisplayed: true, title: '', description: '', dataAttribute: 'board', mode: 'create' });
    };

    return (
        <NavbarContainerStyling data-component="navbar">
            <ul>
                <li><NavLink to="/" data-navbar-button="home">Home</NavLink></li>
                <li><input type="button" value="Create Board" data-create-item-button="board" onClick={handleClick} /></li>
            </ul>
            <CreateModal />
        </NavbarContainerStyling>
    )
};


const mdToProps = (dispatch) => {
    return {
        setModalDisplay: (info) => { dispatch(setModalDisplay(info)) },
    }
}

export default connect(null, mdToProps)(Navbar);