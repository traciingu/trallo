import { useState } from 'react';
import { ModalContainerStyling, ModalOverlayStyling } from './modalStyles';
import { connect } from 'react-redux';
import { setModalDisplay } from '../board/boardSlice';
import { createBoard } from '../board/boardSlice';


const CreateModal = ({ modal, setModalDisplay, createBoard }) => {
    const [modalEditCardTitle, setModalEditCardTitle] = useState(modal.title);

    const handleChange = (e) => {
        setModalEditCardTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalDisplay({ ...modal, title: e.target[0].value, isDisplayed: false });
        createBoard({ title: e.target[0].value });
        setModalEditCardTitle('');
    };

    const handleCloseButtonClick = (e) => {
        setModalDisplay({ ...modal, isDisplayed: false });
    };

    return (
        <ModalOverlayStyling className={modal.isDisplayed && modal.mode.localeCompare('create') === 0 ? '' : 'hide'}>
            <ModalContainerStyling data-modal-type={modal.dataAttribute} className={modal.isDisplayed && modal.mode.localeCompare('create') === 0 ? '' : 'hide'} >
                <input type="button" value="Close" data-small-button="close-modal" onClick={handleCloseButtonClick} />
                <form onSubmit={handleSubmit} data-modal-input-form="title">
                    <input type="text" data-modal-edit-property="title" value={modalEditCardTitle} onChange={handleChange} />
                </form>
            </ModalContainerStyling>
        </ModalOverlayStyling>
    );
}

const mapStateToProps = state => {
    return {
        modal: state.board.modal,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setModalDisplay: (info) => { dispatch(setModalDisplay(info)) },
        createBoard: (info) => { dispatch(createBoard(info)) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateModal);