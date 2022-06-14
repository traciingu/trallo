import { ModalContainerStyling } from '../../app/appStyles';
import { connect } from 'react-redux';
import { setModalDisplay } from '../board/boardSlice';
import { useState } from 'react';

const Modal = ({ modal, setModalDisplay }) => {
    const [canEdit, setCanEdit] = useState(false);
    const [modalEditCardTitle, setModalEditCardTitle] = useState(modal.title);

    const handleClick = () => {
        setCanEdit(true);
        setModalEditCardTitle(modal.title);
    };

    const handleChange = (e) => {
        setModalEditCardTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalDisplay({ ...modal, title: e.target[0].value });
        setCanEdit(false);
    };

    return (
        <ModalContainerStyling data-modal-type="card" className={modal.isDisplayed ? '' : 'hide'} >
            <form onSubmit={handleSubmit} className={canEdit ? '' : 'hide'} data-modal-input-form="title"   >
                <input type="text" data-modal-edit-property="title" value={modalEditCardTitle} onChange={handleChange} />
            </form>
            <h2 data-modal-property="title" onClick={handleClick} className={canEdit ? 'hide' : ''}>
                {modal.title || ""}
            </h2>
            <p data-modal-property="description">{modal.description}</p>
        </ModalContainerStyling>
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

export default connect(mapStateToProps, mapDispatchToProps)(Modal);