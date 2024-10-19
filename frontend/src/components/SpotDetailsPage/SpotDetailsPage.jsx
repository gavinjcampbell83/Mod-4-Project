import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, fetchSpotReviews } from '../../store/spots'; 
import { useParams } from 'react-router-dom';
import './SpotDetailsPage.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreateReviewForm from '../CreateReviewForm/CreateReviewForm'; 
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';

function SpotDetailsPage() {
  const dispatch = useDispatch();
  const { spotid } = useParams();
  const spotDetails = useSelector(state => state.spots.spotDetails);
  const reviews = useSelector(state => state.spots.reviews);
  const currentUser = useSelector(state => state.session.user); 

  useEffect(() => {
    dispatch(fetchSpotDetails(spotid)); 
    dispatch(fetchSpotReviews(spotid));
  }, [dispatch, spotid]);

  if (!spotDetails) return <div>Loading...</div>; 

  const userHasPostedReview = reviews.some((review) => review.userId === currentUser?.id);
  const isSpotOwner = currentUser?.id === spotDetails.Owner?.id;

  const handleReserveClick = () => {
    alert("Feature Coming Soon..."); 
  };

  return (
    <div data-testid='spot-tile' className="spot-details-page">
        <h2 data-testid="spot-name" className="spot-details-name">{spotDetails.name}</h2>
        <div data-testid="spot-location" className="location">
            <div data-testid="spot-city">
            {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
            </div>
        </div>

        <div className="details-container">
            <img 
                data-testid='spot-large-image'
                className="spot-image" 
                src={spotDetails.SpotImages[0]?.url} 
                alt={spotDetails.name} 
            />

            <div data-testid='spot-small-image' className="other-images">
                {spotDetails.SpotImages.slice(1).map((image) => (
                    <img 
                        key={image.id} 
                        className="thumbnail" 
                        src={image.url} 
                        alt="Spot Thumbnail" 
                    />
                ))}
            </div>
        </div>
        <div className="info-container">
            <div className="spot-info">
                <div data-testid='spot-host' className="host-info">
                    Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
                </div>
                <div data-testid="spot-description" className="description">{spotDetails.description}</div>
            </div>
            <div className="price-info">
                <div data-testid='spot-callout-box' className="bordered-box">
                    <div data-testid='spot-price' className="price">${spotDetails.price} per night</div>
                    <div className="review-summary">
                        <div data-testid='spot-rating' className="average-rating">
                            <span className="star-icon">★</span> 
                            {spotDetails.avgStarRating ? spotDetails.avgStarRating.toFixed(1) : 'New'} 
                            {spotDetails.numReviews > 0 && (
                                <>
                                    <span className="dot"> · </span>
                                    {spotDetails.numReviews === 1 ? "1 Review" : `${spotDetails.numReviews} Reviews`}
                                </>
                            )}
                        </div>
                    </div>
                    <button data-testid="reserve-button" className="reserve-button" onClick={handleReserveClick}>Reserve</button>
                </div>
            </div>
        </div>
        <hr className="divider" />

        <div data-testid='review-list' className="reviews-section">
            <h3 data-testid='reviews-heading'>Reviews</h3>
            <div className="review-summary">
                <div data-testid='review-count' className="average-rating">
                    <span className="star-icon">★</span> 
                    {spotDetails.avgStarRating ? spotDetails.avgStarRating.toFixed(1) : 'New'} 
                    {spotDetails.numReviews > 0 && (
                        <>
                            <span className="dot"> · </span>
                            {spotDetails.numReviews === 1 ? "1 Review" : `${spotDetails.numReviews} Reviews`}
                        </>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                {currentUser && !userHasPostedReview && !isSpotOwner && (
                    <OpenModalButton
                        data-testid='review-button'
                        buttonText="Post Your Review"
                        modalComponent={<CreateReviewForm spotId={spotid} />}
                        onModalClose={() => {}}
                        className='small-button post-review-button'
                        style={{ width: '50%' }}
                    />
                )}
            </div>

            <div className="reviews-container">
    {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews
            .slice() 
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
            .map((review) => (
                <div data-testid='review-item' className="review" key={review.id}>
                    <div className="review-header">
                        <div className="reviewer-name">{review.User?.firstName || 'Anonymous'}</div>
                        <div data-testid='review-date' className="review-date">
                            {new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <div data-testid='review-text' className="review-details">{review.review}</div>
                    {currentUser?.id === review.userId && (
                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotid} />}
                            className='small-button delete-review-button'
                            style={{ width: '100px' }}
                        />
                    )}
                </div>
            ))
    ) : (
        <div>Be the first to post a review!</div>
    )}
</div>
        </div>
    </div>
);
}

export default SpotDetailsPage;