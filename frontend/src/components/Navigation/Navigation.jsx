import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <div className="profile-container">
      <ProfileButton user={sessionUser} />
    </div>
  ) : (
    <ul className="navigation-menu">
      <li>
        <NavLink to="/login" className="nav-link">Log In</NavLink>
      </li>
      <li>
        <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
      </li>
    </ul>
  );

  return (
    <nav className="navigation-container">
      <ul className="navigation-menu">
        <li>
          <NavLink exact to="/" className="nav-link">Home</NavLink>
        </li>
      </ul>
      {isLoaded && sessionLinks}
    </nav>
  );
}

export default Navigation;