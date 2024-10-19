import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
  
    const toggleMenu = (e) => {
      e.stopPropagation();
      setShowMenu(!showMenu);
    };
  
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };
  
      document.addEventListener('click', closeMenu);
  
      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);
  
    const closeMenu = () => setShowMenu(false);
  
    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
      closeMenu();
      navigate('/');
    };

    const manageSpots = () => {
      navigate('/spots/current'); 
      closeMenu();
    };
  
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  
    return (
        <div className="profile-container"> 
          <button onClick={toggleMenu} className="profile-button" data-testid='user-menu-button'> 
          <FaBars className="icon-bars" />
          <FaUserCircle className="icon-user" /> 
          </button>
          <ul className={ulClassName} ref={ulRef} data-testid='user-dropdown-menu'> 
            {user ? (
              <>
                <li className='greeting'>Hello, {user.firstName}</li>
                <li className='greeting-email'>{user.email}</li>
                <li>
                  <button className='manage-spots-button' data-testid='manage-spots-link' onClick={manageSpots}>Manage Spots</button> 
                </li>
                <li>
                  <button className='logout-button' onClick={logout}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </>
            )}
          </ul>
        </div>
      );
    }
    
  export default ProfileButton;