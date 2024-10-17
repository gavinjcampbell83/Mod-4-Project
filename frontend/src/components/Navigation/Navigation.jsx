import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
      <nav className="navigation-container">
        <ul className="navigation-menu">
          <li>
            <NavLink to="/" className="nav-link">Bearbnb</NavLink>
          </li>
        </ul>
        {isLoaded && (
          <div className="profile-container">
            {sessionUser && (
              <NavLink to="/spots/new" className="nav-link create-spot-button">
                Create a New Spot
              </NavLink>
            )}
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </nav>
    );
  }
  
  export default Navigation;