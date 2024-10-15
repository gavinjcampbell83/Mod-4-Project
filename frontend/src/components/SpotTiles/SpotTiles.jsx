import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from "../../store/spots";
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
                <div key={spot.id} className="spot-tile">
                    <img src={spot.url} alt={spot.name} />
                    <div>{spot.city}, {spot.state}</div>
                    <div>${spot.price} / night</div>
                    <div>
                        <span className="star-icon">★</span>
                        {spot.avgRating}
                    </div>
                </div>
      ))}
        </div>
    );
};


export default SpotTiles;