import React, { useReducer, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { getUsers } from '../services/api';
import { validateEmail, validatePassword } from '../validators/validation';
import { buttonType } from '../constants/buttonType';

const initialState = {
  email: '',
  password: '',
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', payload: '' });

    const { email, password } = state;

    if (!email || !password) {
      dispatch({ type: 'SET_ERROR', payload: 'Enter email and password' });
      return;
    }

    const { success: isEmail, error: errorEmail } = validateEmail(email);
    if (!isEmail) {
      dispatch({ type: 'SET_ERROR', payload: errorEmail.errors[0].message });
      return;
    }

    const { success: isPassword, error: errorPassword } = validatePassword(password);
    if (!isPassword) {
      dispatch({ type: 'SET_ERROR', payload: errorPassword.errors[0].message });
      return;
    }

    try {
      const users = await getUsers({ email, password });
      const user = users[0];

      if (user) {
        login(user);
        navigate('/home');
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'User not found' });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred. Please try again.' });
    }
  }, [state, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-center text-2xl font-bold mb-4">Log in</h1>
      <form
        className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleLogin}
      >
        <input
          placeholder="email"
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2"
        />
        <input
          placeholder="password"
          type="password"
          value={state.password}
          onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2"
        />
        {state.error && <div className="text-red-600 mb-2">{state.error}</div>}
        <Button
          type="submit"
          variant={buttonType.blue}
          classes="mb-2"
          title="Log in"
        />
        <div className="text-center mb-2">If you don&apos;t have an account</div>
        <Button
          variant={buttonType.blue}
          classes="mb-2"
          title="Register"
          handleClick={() => navigate('/signup')}
        />
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch({ type: 'LOGIN', payload: user }),
});

export default connect(null, mapDispatchToProps)(Login);