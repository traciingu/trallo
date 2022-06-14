import Modal from "../modal/Modal";
import { connect } from "react-redux";
import { setModalDisplay } from "../board/boardSlice";


const Homepage = ({setModalDisplay, modal}) => {

    const handleOnClick = (e) => {
        setModalDisplay({isDisplayed: true, title: '', description: '', dataAttribute: 'board'});
    };

    return (
        <div>
            <div data-placeholder="empty-homepage">You have no boards</div>
            <input type="button" value="Create Board" data-medium-button="homepage-create-board" onClick={handleOnClick}/>
            <Modal />
        </div>
    );
}

const msToProps = (state) => {
    return {
        modal: state.board.modal,
    };
};

const mdToProps = (dispatch) => {
    return {
        setModalDisplay: (info) => { dispatch(setModalDisplay(info)) },
    };
};

export default connect(msToProps, mdToProps)(Homepage);