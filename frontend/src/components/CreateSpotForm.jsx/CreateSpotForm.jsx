import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CreateSpotForm.css';
import { createSpot, addSpotImage } from '../../store/spots';

const CreateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [images, setImages] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
    if (!country) validationErrors.country = 'Country is required';
    if (!address) validationErrors.address = 'Street Address is required';
    if (!city) validationErrors.city = 'City is required';
    if (!state) validationErrors.state = 'State is required';
    if (description.length < 30) validationErrors.description = 'Description needs a minimum of 30 characters';
    if (!name) validationErrors.name = 'Name is required';
    if (!price) validationErrors.price = 'Price is required';
    if (!previewImage) validationErrors.previewImage = 'Preview image is required';
    if (!lat || lat < -90 || lat > 90) validationErrors.lat = 'Latitude is required and must be within -90 and 90';
    if (!lng || lng < -180 || lng > 180) validationErrors.lng = 'Longitude is required and must be within -180 and 180';
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const newSpotData = {
      country,
      address,
      city,
      state,
      description,
      name,
      price,
      lat,
      lng
    };
  
    const createdSpot = await dispatch(createSpot(newSpotData));
  
    if (createdSpot && createdSpot.id) {
      const allImages = [{ url: previewImage, preview: true }, ...images.map(img => ({ url: img, preview: false }))];

      for (let img of allImages) {
        if (img.url) {
          await dispatch(addSpotImage(createdSpot.id, img.url, img.preview));
        }
      }

      navigate(`/spots/${createdSpot.id}`);
    }
  };

  return (
    <div className="new-spot-form">
      <h1>Create a New Spot</h1>
  
      <form onSubmit={handleSubmit}>
        <h2>Where&apos;s your place located?</h2>
        <p>Guests will only get your exact address once they book a reservation.</p>
        
        <label htmlFor="country">Country</label>
        <input 
          value={country} 
          onChange={e => setCountry(e.target.value)} 
          placeholder="Country" 
        />
        {errors.country && <p className="error">{errors.country}</p>}
        
        <label htmlFor="address">Street Address</label>
        <input 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          placeholder="Street Address" 
        />
        {errors.address && <p className="error">{errors.address}</p>}
        
        <label htmlFor="city">City</label>
        <input 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          placeholder="City" 
        />
        {errors.city && <p className="error">{errors.city}</p>}
        
        <label htmlFor="state">State</label>
        <input 
          value={state} 
          onChange={e => setState(e.target.value)} 
          placeholder="State" 
        />
        {errors.state && <p className="error">{errors.state}</p>}
        
        <label htmlFor="latitude">Latitude</label>
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
        />
        {errors.lat && <p className="error">{errors.lat}</p>}
  
        <label htmlFor="longitude">Longitude</label>
        <input
          type="number"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
        />
        {errors.lng && <p className="error">{errors.lng}</p>}

        <div className="separator"></div>
  
        <h2>Describe your place to guests:</h2>
        <h1 className='description-header'>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h1>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Please write at least 30 characters"
        ></textarea>
        {errors.description && <p className="error">{errors.description}</p>}

        <div className="separator"></div>
  
        <h2>Create a title for your spot:</h2>
        <h1 className='description-header'>Catch guests&apos; attention with a spot title that highlights what makes your place special.</h1>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name of your spot" />
        {errors.name && <p className="error">{errors.name}</p>}
  
        <h2>Set a base price for your spot:</h2>
        <h1 className='description-header'>Competitive pricing can help your listing stand out and rank higher in search results.</h1>
        <input 
          type="number" 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
          placeholder="Price per night (USD)" 
        />
        {errors.price && <p className="error">{errors.price}</p>}

        <div className="separator"></div>
  
        <h2>Liven up your spot with photos:</h2>
        <h1 className='description-header'>Submit a link to at least one photo to publish your spot.</h1>
        <input 
          value={previewImage} 
          onChange={e => setPreviewImage(e.target.value)} 
          placeholder="Preview Image URL" 
        />
        {errors.previewImage && <p className="error">{errors.previewImage}</p>}
        
        {images.map((img, idx) => (
          <input 
            key={idx} 
            value={img} 
            onChange={e => {
              const newImages = [...images];
              newImages[idx] = e.target.value;
              setImages(newImages);
            }} 
            placeholder={'Image URL'} 
          />
        ))}
  
        <div className="separator"></div>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;