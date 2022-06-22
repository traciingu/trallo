import { useEffect } from "react";
import { connect } from "react-redux";
import { setModalDisplay } from "../board/boardSlice";
import { getBoardCollection } from "../boardCollection/boardCollectionSlice";
import { Link } from "react-router-dom";
import { BoardsCollectionGrid, BoardsCollectionItem } from "./homepageStyling";


const Homepage = ({ setModalDisplay, getBoardCollection, boards }) => {

    const handleOnClick = (e) => {
        setModalDisplay({ isDisplayed: true, title: '', description: '', dataAttribute: 'board', mode: 'create' });
    };

    useEffect(() => {
        getBoardCollection();
    }, []);

    return (
        <div>
            <div data-collection="board">
                {
                    boards.length === 0 ?
                        <>
                            <div data-placeholder="empty-homepage">You have no boards</div>
                            <input type="button" value="Create Board" data-medium-button="homepage-create-board" onClick={handleOnClick} />
                        </>
                        :
                        <BoardsCollectionGrid>
                            {boards.map(board =>
                                <Link
                                    data-board-collection-item-title={board.title}
                                    data-board-collection-item-id={board.id}
                                    to={`/b/${board.id}`}
                                    key={board.id}
                                >
                                    <BoardsCollectionItem>
                                        <h1>
                                            {board.title}
                                        </h1>
                                    </BoardsCollectionItem>
                                </Link>
                            )}
                        </BoardsCollectionGrid>
                }
            </div>
        </div>
    );
}

const msToProps = (state) => {
    return {
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