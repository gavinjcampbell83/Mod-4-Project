
export const LOAD_SPOTS = 'spots/Load_SPOTS';

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    if(response.ok) {
        const data = await response.json();
        console.log(data); 
        dispatch(loadSpots(data.Spots)); 
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
            default:
                return state;
    }
};

export default spotsReducer;