import { ModalContainerStyling, ModalOverlayStyling } from './modalStyles';
import { connect } from 'react-redux';
import { setModalDisplay } from '../board/boardSlice';
import { useState } from 'react';

const CreateModal = ({ modal, setModalDisplay }) => {
    const [modalEditCardTitle, setModalEditCardTitle] = useState(modal.title);

    const handleChange = (e) => {
        setModalEditCardTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalDisplay({ ...modal, title: e.target[0].value, isDisplayed: false });
    };

    const handleCloseButtonClick = (e) => {
        setModalDisplay({ ...modal, isDisplayed: false });
    };

    return (
        <ModalOverlayStyling className={modal.isDisplayed ? '' : 'hide'}>
            <ModalContainerStyling data-modal-type={modal.dataAttribute} className={modal.isDisplayed ? '' : 'hide'} >
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateModal);