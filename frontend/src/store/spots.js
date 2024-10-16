
export const LOAD_SPOTS = 'spots/Load_SPOTS';
export const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';
export const LOAD_SPOT_REVIEWS = 'spots/LOAD_SPOT_REVIEWS';


const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

const loadSpotDetails = (spot) => ({
    type: LOAD_SPOT_DETAILS,
    spot,
});

const loadSpotReviews = (reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    reviews,
});

export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    if(response.ok) {
        const data = await response.json();
        dispatch(loadSpots(data.Spots)); 
    }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();
      dispatch(loadSpotDetails(spot));
    }
  };

export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotReviews(data.Reviews));
    }
}

const initialState = {
    spotDetails: null, 
    reviews: [],
    spots: {},
};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newSpots = {};
            action.spots.forEach(spot => {
                newSpots[spot.id] = spot;                
            });
            return { ...state, spots: { ...state.spots, ...newSpots } };
        }
        case LOAD_SPOT_DETAILS: 
            return { ...state, spotDetails: action.spot };
        case LOAD_SPOT_REVIEWS:
            return { ...state, reviews: action.reviews };
            default:
                return state;
    }
};

export default spotsReducer;