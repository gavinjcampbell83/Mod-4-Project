import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSpotDetails, updateSpot } from '../../store/spots'; 
import '../CreateSpotForm/CreateSpotForm.css';

const UpdateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spots.spotDetails); 
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spotDetails) {
      setName(spotDetails.name || '');
      setAddress(spotDetails.address || '');
      setCity(spotDetails.city || '');
      setState(spotDetails.state || '');
      setCountry(spotDetails.country || '');
      setLat(spotDetails.lat || '');
      setLng(spotDetails.lng || '');
      setPrice(spotDetails.price || '');
      setDescription(spotDetails.description || '');
      setPreviewImage(spotDetails.previewImage || '');
      setImages(spotDetails.images || []);
    }
  }, [spotDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedSpot = {
      name,
      address,
      city,
      state,
      country,
      lat,
      lng,
      price,
      description,
      previewImage,
      images,
    };

    
    setErrors({});

    try {
      const updatedData = await dispatch(updateSpot(spotId, updatedSpot));

      if (updatedData.errors) {
        setErrors(updatedData.errors); 
      } else {
        navigate(`/spots/${spotId}`); 
      }
    } catch (error) {
      console.error('Error updating spot:', error);
    }
  };

  if (!spotDetails) return <div>Loading...</div>;

  return (
    <div data-testid='update-spot-form' className="new-spot-form">
      <h1 data-testid='form-title'>Update your Spot</h1>

      <form onSubmit={handleSubmit}>

        <div data-testid='section-1'>
          <div data-testid='spot-location'>
            <h2 data-testid='section-1-heading'>Where&apos;s your place located?</h2>
            <p data-testid='section-1-caption'>Guests will only get your exact address once they booked a reservation.</p>

            <label htmlFor="Country">Country
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Country"
              />
            </label>
            {errors.country && <p className="error">{errors.country}</p>}

            <label htmlFor="Street Address">Street Address
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Street Address"
              />
            </label>
            {errors.address && <p className="error">{errors.address}</p>}

            <label htmlFor="City">City
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City"
              />
            </label>
            {errors.city && <p className="error">{errors.city}</p>}

            <label htmlFor="State">State
              <input
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="State"
              />
            </label>
            {errors.state && <p className="error">{errors.state}</p>}

            <label htmlFor="Latitude">Latitude
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
              />
            </label>
            {errors.lat && <p className="error">{errors.lat}</p>}

            <label htmlFor="Longitude">Longitude
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
              />
            </label>
            {errors.lng && <p className="error">{errors.lng}</p>}
          </div>
        </div>

        <div className="separator"></div>

        <div data-testid="section-2">
          <h2 data-testid='section-2-heading'>Describe your place to guests</h2>
          <h1 data-testid='section-2-caption' className='description-header'>
            Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
          </h1>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="separator"></div>

        <div data-testid='section-3'>
          <h2 data-testid='section-3-heading'>Create a title for your spot</h2>
          <h1 data-testid='section-3-caption' className='description-header'>
            Catch guests&apos; attention with a spot title that highlights what makes your place special.
          </h1>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name of your spot"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="separator"></div>

        <div data-testid='section-4'>
          <h2 data-testid='section-4-heading'>Set a base price for your spot</h2>
          <h1 data-testid='section-4-caption' className='description-header'>
            Competitive pricing can help your listing stand out and rank higher in search results.
          </h1>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>    

        <div className="separator"></div>

        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;