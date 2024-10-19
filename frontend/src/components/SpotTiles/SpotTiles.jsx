import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from "../../store/spots";
import { Link } from 'react-router-dom';
import './SpotTiles.css';

const SpotTiles = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.spots);
   

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <div data-testid='spots-list' className="spot-grid">
            {Object.values(spots).map(spot => (
               <div data-testid='spot-tile' key={spot.id} className="spot-tile-wrapper">
                <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-tile" data-testid='spot-link'>
                <div data-testid='spot-name' className="spot-name">
                        <span data-testid='spot-tooltip' className="spot-tooltip">{spot.name}</span>
                </div>
                <img data-testid='spot-thumbnail-image' src={spot.previewImage} alt={spot.name} />
                <div className="spot-info">
                    <div className="location-price-rating">
                        <div className="location-price">
                            <div data-testid='spot-city'>{spot.city}, {spot.state}</div>
                            <div data-testid='spot-price'>${spot.price} / night</div>
                        </div>
                        <div data-testid='spot-rating' className="star-rating">
                            <span className="star-icon">★</span>
                            {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                        </div>
                    </div>
                </div>
            </Link>
            </div>
            ))}
        </div>
    );
};

export default SpotTiles;

