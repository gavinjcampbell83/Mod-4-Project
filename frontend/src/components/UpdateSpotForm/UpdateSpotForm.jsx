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

    try {
      await dispatch(updateSpot(spotId, updatedSpot));
      navigate(`/spots/${spotId}`); 
    } catch (error) {
      console.error('Error updating spot:', error);
    }
  };

  if (!spotDetails) return <div>Loading...</div>;

  return (
    <div className="new-spot-form">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name of your spot"
          />
        </label>

        <label>
          Street Address
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Street Address"
          />
        </label>

        <label>
          City
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="City"
          />
        </label>

        <label>
          State
          <input 
            type="text" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            placeholder="State"
          />
        </label>

        <label>
          Country
          <input 
            type="text" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            placeholder="Country"
          />
        </label>

        <label>
          Latitude
          <input 
            type="number" 
            value={lat} 
            onChange={(e) => setLat(e.target.value)} 
            placeholder="Latitude"
          />
        </label>

        <label>
          Longitude
          <input 
            type="number" 
            value={lng} 
            onChange={(e) => setLng(e.target.value)} 
            placeholder="Longitude"
          />
        </label>

        <label>
          Price per night (USD)
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Price per night"
          />
        </label>

        <label>
          Description
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe your spot"
          />
        </label>
        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;