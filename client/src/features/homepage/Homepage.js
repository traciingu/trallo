import CreateModal from "../modal/CreateModal";
import { connect } from "react-redux";
import { setModalDisplay } from "../board/boardSlice";


const Homepage = ({setModalDisplay, modal}) => {

    const handleOnClick = (e) => {
        setModalDisplay({isDisplayed: true, title: '', description: '', dataAttribute: 'board', mode: 'create'});
    };

    return (
        <div>
            <div data-placeholder="empty-homepage">You have no boards</div>
            <input type="button" value="Create Board" data-medium-button="homepage-create-board" onClick={handleOnClick}/>
            <CreateModal />
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