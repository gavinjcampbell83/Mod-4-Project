import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/Load_SPOTS';
export const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';
export const LOAD_SPOT_REVIEWS = 'spots/LOAD_SPOT_REVIEWS';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const ADD_SPOT_IMAGE = 'spots/ADD_SPOT_IMAGE';
export const POST_REVIEW = 'spots/POST_REVIEW';
export const POST_REVIEW_SUCCESS = 'spots/POST_REVIEW_SUCCESS';
export const POST_REVIEW_ERROR = 'spots/POST_REVIEW_ERROR';

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

const createSpotAction = (spot) => ({
    type: CREATE_SPOT,
    spot,
});

const addSpotImageAction = (spotId, image) => ({
    type: ADD_SPOT_IMAGE,
    spotId,
    image,
});

const postReview = () => ({
    type: POST_REVIEW,
});

const postReviewSuccess = (newReview) => ({
    type: POST_REVIEW_SUCCESS,
    payload: newReview,
});

const postReviewError = (error) => ({
    type: POST_REVIEW_ERROR,
    payload: error,
});

export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    if (response.ok) {
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
};

export const createSpot = (spotData) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(spotData),
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(createSpotAction(spot));
        return spot;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const addSpotImage = (spotId, imageUrl, isPreview) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: imageUrl,
            preview: isPreview,
        }),
    });

    if (response.ok) {
        const image = await response.json();
        dispatch(addSpotImageAction(spotId, image));
        return image;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
    dispatch(postReview());

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const newReview = await response.json();
        dispatch(postReviewSuccess(newReview));
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchSpotReviews(spotId));
        return newReview; 
    } else {
        const error = await response.json();
        dispatch(postReviewError(error));
        throw error; 
    }
};


const initialState = {
    spotDetails: null,
    reviews: [],
    spots: {},
    loading: false,
    error: null,
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
        case CREATE_SPOT: {
            const newState = { ...state, spots: { ...state.spots } };
            newState.spots[action.spot.id] = action.spot;
            return newState;
        }
        case ADD_SPOT_IMAGE: {
            const newState = { ...state, spots: { ...state.spots } };
            if (newState.spots[action.spotId]) {
                newState.spots[action.spotId].images = [
                    ...(newState.spots[action.spotId].images || []),
                    action.image
                ];
            }
            return newState;
        }
        case POST_REVIEW:
            return { ...state, loading: true, error: null };
        case POST_REVIEW_SUCCESS: {
            const newReviews = [...state.reviews, action.payload];
            return { ...state, reviews: newReviews, loading: false };
        }
        case POST_REVIEW_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default spotsReducer;