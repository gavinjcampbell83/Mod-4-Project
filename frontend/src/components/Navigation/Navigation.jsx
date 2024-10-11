import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <div className="profile-container">
      <ProfileButton user={sessionUser} />
    </div>
  ) : (
    <>
    <ul className="navigation-menu">
    <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    </ul>
    </>
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