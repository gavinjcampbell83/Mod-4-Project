
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails, fetchSpotReviews } from '../../store/spots'; 
import { useParams } from 'react-router-dom';
import './SpotDetailsPage.css'

function SpotDetailsPage() {
  const dispatch = useDispatch();
  const { spotid } = useParams();
  const spotDetails = useSelector(state => state.spots.spotDetails);
  const reviews = useSelector(state => state.spots.reviews);
    

  useEffect(() => {
    dispatch(fetchSpotDetails(spotid)); 
    dispatch(fetchSpotReviews(spotid));
  }, [dispatch, spotid]);

  if (!spotDetails) return <div>Loading...</div>; 

  const handleReserveClick = () => {
    alert("Feature Coming Soon..."); 
  };

  return (
    <div className="spot-details-page">
        <h2 className="spot-name">{spotDetails.name}</h2>
        <div className="location">
            {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
        </div>

        <div className="details-container">
            <img 
                className="spot-image" 
                src={spotDetails.SpotImages[0]?.url} 
                alt={spotDetails.name} 
            />

            {/* Other Images Placeholder */}
            <div className="other-images">
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
                <div className="host-info">
                    Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
                </div>
                <div className="description">{spotDetails.description}</div>
            </div>
            <div className="price-info">
                <div className="bordered-box">
                    <div className="price">${spotDetails.price} per night</div>
                    <div className="review-summary">
                        <div className="average-rating">
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
                    <button className="reserve-button"  onClick={handleReserveClick}>Reserve</button>
                </div>
            </div>
        </div>
        <hr className="divider" />
        <div className="reviews-section">
            <h3>Reviews</h3>
            <div className="review-summary">
            <div className="average-rating">
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
        {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review) => (
            <div className="review" key={review.id}>
                <div className="reviewer-name">{review.User?.firstName || 'Anonymous'}</div> 
                <div className="review-date">{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                <div className="review-details">{review.review}</div>
            </div>
        ))
    ) : (
        <div>Be the first to post a review!</div>
    )}
        </div>
    </div>
    );
}


export default SpotDetailsPage;