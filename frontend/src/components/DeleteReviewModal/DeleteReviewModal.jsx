import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/spots'; 
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId, spotId)); 
      closeModal(); 
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div data-testid='delete-review-modal' className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="button-container">
      <button data-testid='confirm-delete-review-button' className="delete-button" onClick={handleDelete}>Yes (Delete Review)</button>
      <button className="cancel-button" onClick={closeModal}>No (Keep Review)</button>
      </div>
      </div>
    
  );
}

export default DeleteReviewModal;