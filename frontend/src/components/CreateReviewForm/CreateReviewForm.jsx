import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/spots';
import './CreateReviewForm.css';

function CreateReviewForm({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (review.length < 10) {
      setErrors({ review: "Review must be at least 10 characters long" });
      return;
    }

    if (stars === 0) {
      setErrors({ stars: "Please provide a star rating" });
      return;
    }
   
    return dispatch(createReview(spotId, { review, stars })) 
      .then(() => {
        closeModal(); 
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors); 
        }
      });
  };

   const renderStars = () => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      starElements.push(
        <span
          key={i}
          className={`star ${i <= (hoveredStars || stars) ? 'filled' : 'empty'}`}
          onClick={() => setStars(i)} 
          onMouseEnter={() => setHoveredStars(i)} 
          onMouseLeave={() => setHoveredStars(0)} 
        >
          ★
        </span>
      );
    }
    return starElements;
  };

  return (
    <>
    <div data-testid='review-modal'></div>
      <h2>How was your stay?</h2>
      <form data-testid='review-form' onSubmit={handleSubmit}>
        <label>
          Review
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Leave your review here..."
            required
          />
        </label>
        {errors.review && <p className="error">{errors.review}</p>}

        <div data-testid='review-star-clickable' className="stars-container">
          {renderStars()}
          Stars
        </div>
        {errors.stars && <p className="error">{errors.stars}</p>}

        <button data-testid='review-button' type="submit" disabled={review.length < 10 || stars <= 0}>
          Submit Your Review
        </button>
      </form>
    </>
  );
}

export default CreateReviewForm;