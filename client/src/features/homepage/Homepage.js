import CreateModal from "../modal/CreateModal";
import { connect } from "react-redux";
import { setModalDisplay } from "../board/boardSlice";
import { getBoardCollection } from "../boardCollection/boardCollectionSlice";
import { useEffect } from "react";


const Homepage = ({ setModalDisplay, modal, getBoardCollection, boards }) => {

    const handleOnClick = (e) => {
        setModalDisplay({ isDisplayed: true, title: '', description: '', dataAttribute: 'board', mode: 'create' });
    };

    useEffect(() => {
        getBoardCollection();
    }, []);

    return (
        <div>
            <div data-placeholder="empty-homepage">You have no boards</div>
            <input type="button" value="Create Board" data-medium-button="homepage-create-board" onClick={handleOnClick} />
            <div data-collection="board">
                {boards.map(board => <div data-board-collection-item-title={board.title}>{board.title}</div>)}
            </div>
            <CreateModal />
        </div>
    );
}

const msToProps = (state) => {
    return {
        modal: state.board.modal,
        boards: state.boardCollection.boards
    };
};

const mdToProps = (dispatch) => {
    return {
        setModalDisplay: (info) => { dispatch(setModalDisplay(info)) },
        getBoardCollection: (info) => { dispatch(getBoardCollection(info)) }
    };
};

export default connect(msToProps, mdToProps)(Homepage);