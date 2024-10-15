
export const LOAD_SPOTS = 'spots/Load_SPOTS';
export const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';


const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

export const loadSpotDetails = (spot) => ({
    type: LOAD_SPOT_DETAILS,
    spot,
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

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;                
            });
            return newState;
        }
        case LOAD_SPOT_DETAILS: // No braces here, just follow the previous case
        return { ...state, spotDetails: action.spot };
            default:
                return state;
    }
};

export default spotsReducer;