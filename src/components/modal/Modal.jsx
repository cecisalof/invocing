import React from 'react'
import PropTypes from 'prop-types';

export default function Modal(props) {

    const { handleTrashClick, page } = props;

    return (
        <>
            <div className="modal fade bg-transparent" id="mainModal" tabIndex="-1" aria-labelledby="mainModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="mainModalLabel">Confirmar eliminación</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {page == 'suppliers' ? (
                            <div className="modal-body">
                                ¿Estás seguro de borrar estos datos y todos los relacionados con los mismos?
                            </div>
                        ) : (
                            <div className="modal-body">
                                ¿Estás seguro de eliminar estos archivos?
                            </div>)}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleTrashClick}>Confirmar</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

Modal.propTypes = {
    handleTrashClick: PropTypes.func,
    props: PropTypes.object,
    page: PropTypes.string
};
