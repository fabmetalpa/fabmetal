import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";

const PlaceBidModal = ({ show, handleModal }) => (
    <Modal
        className="rn-popup-modal placebid-modal-wrapper"
        show={show}
        onHide={handleModal}
        centered
    >
        {show && (
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleModal}
            >
                <i className="feather-x" />
            </button>
        )}
        <Modal.Header>
            <h3 className="modal-title">Agregar al Carrito</h3>
        </Modal.Header>
        <Modal.Body>
            <p>Estas seguro que deseas agregar este articulo a tu Carrito</p>
            <div className="placebid-form-box">
                <h5 className="title">Cantidad</h5>
                <div className="bid-content">
                    <div className="bid-content-top">
                        <div className="bid-content-left">
                            <input id="value" type="text" name="value" />
                            <span>Cantidad</span>
                        </div>
                    </div>

                    <div className="bid-content-mid">
                        <div className="bid-content-left">
                            <span>Precio</span>
                            <span>Total</span>
                        </div>
                        <div className="bid-content-right">
                            <span>100$</span>
                            <span>200$</span>
                        </div>
                    </div>
                </div>
                <div className="bit-continue-button">
                    <Button path="/" size="medium" fullwidth>
                        Agregar al carrito
                    </Button>
                    <Button
                        color="primary-alta"
                        size="medium"
                        className="mt--10"
                        onClick={handleModal}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

PlaceBidModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
};
export default PlaceBidModal;
