import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({general: data.message});
        }
        
      });
  };
  
  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.message){
        setErrors({general: data.message})
      }
    })
  }

  const isDisabled = credential.length < 4 || password.length < 6;

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            data-testid='credential-input'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            data-testid='password-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.general && (
          <p className='error'>{errors.general}</p>
        )}
      <div className="button-container">
          <button data-testid='login-button' type="submit" disabled={isDisabled}>Log In</button>
          <button data-testid='demo-user-login' className="demo-login" onClick={handleDemoLogin}>
            Log in as Demo User
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;