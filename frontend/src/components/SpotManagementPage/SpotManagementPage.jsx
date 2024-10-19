import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSpots } from '../../store/spots'; 
import { Link, useNavigate } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal'; 
import '../SpotTiles/SpotTiles.css'; 

const SpotManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.spots); 
  const currentUser = useSelector((state) => state.session.user); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
      if (currentUser?.id) {
          setLoading(true); 
          dispatch(fetchUserSpots()).then(() => setLoading(false));
      }
  }, [dispatch, currentUser?.id]);

  const handleUpdate = (spotId) => {
      navigate(`/spots/${spotId}/edit`); 
  };

  if (loading) {
      return <div>Loading...</div>; 
  }

  return (
      <>
      <h1>Manage Spots</h1>
      <div data-testid='user-spots' className="spot-grid">
          {Object.keys(spots).length === 0 ? (
              <Link to="/spots/new" className="create-new-spot">
                  Create a New Spot
              </Link>
          ) : (
              Object.values(spots).map(spot => (
                  <div key={spot.id} className="spot-tile" title={spot.name}>
                      <Link to={`/spots/${spot.id}`}>
                          <img src={spot.previewImage} alt={spot.name} />
                          <div className="spot-info">
                              <div className="location-price-rating">
                                  <div className="location-price">
                                      <div>{spot.city}, {spot.state}</div>
                                      <div>${spot.price} / night</div>
                                  </div>
                                  <div className="star-rating">
                                      <span className="star-icon">★</span>
                                      {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                                  </div>
                              </div>
                          </div>
                      </Link>
                      <div className="spot-actions">
                          <button 
                              className="update-button" 
                              onClick={() => handleUpdate(spot.id)}
                          >
                              Update
                          </button>
                          <OpenModalButton 
                              buttonText="Delete" 
                              modalComponent={<DeleteSpotModal spotId={spot.id} />} 
                              className="delete-button" 
                          />
                      </div>
                  </div>
              ))
          )}
      </div>
      </>
  );
};

export default SpotManagementPage;