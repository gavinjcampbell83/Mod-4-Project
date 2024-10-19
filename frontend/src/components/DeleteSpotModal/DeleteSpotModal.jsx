import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots'; 
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css'; 

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(spotId)); 
      closeModal(); 
    } catch (error) {
      console.error("Error deleting spot:", error);
    }
  };

  return (
    <div className="delete-spot-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this spot?</p>
      <div className="button-container">
      <button className="delete-button" onClick={handleDelete}>Yes (Delete Spot)</button>
      <button className="cancel-button" onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;