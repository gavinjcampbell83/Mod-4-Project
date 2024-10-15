import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from "../../store/spots";
import { Link } from 'react-router-dom';
import './SpotTiles.css';




const SpotTiles = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots);


    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <div className="spot-grid">
            {Object.values(spots).map(spot => (
                <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-tile" title={spot.name}> 
                <img src={spot.previewImage} alt={spot.name} />
                <div className="spot-info">
                    <div className="location-price">
                        <div>{spot.city}, {spot.state}</div>
                        <div>${spot.price} / night</div>
                    </div>
                    <div className="star-rating">
                        <span className="star-icon">★</span>
                        {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                    </div>
                </div>
            </Link>
            ))}
        </div>
    );
};

export default SpotTiles;