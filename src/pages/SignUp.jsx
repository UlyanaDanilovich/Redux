import React, { useReducer, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { getUsers, postUser } from '../services/api';
import { validateEmail, validatePassword } from '../validators/validation';
import { buttonType } from '../constants/buttonType';

const initialState = {
  email: '',
  password: '',
  repeatPassword: '',
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_REPEAT_PASSWORD':
      return { ...state, repeatPassword: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const SignUp = ({ login }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', payload: '' });

    const { email, password, repeatPassword } = state;

    if (!email || !password || !repeatPassword) {
      dispatch({ type: 'SET_ERROR', payload: 'Enter email and password' });
      return;
    }

    if (password !== repeatPassword) {
      dispatch({ type: 'SET_ERROR', payload: 'Passwords do not match' });
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
      const users = await getUsers({ email });
      if (users[0]) {
        dispatch({ type: 'SET_ERROR', payload: 'User with this email already exists' });
        return;
      }

      const newUserBody = {
        email,
        password,
        createdAt: Date.now(),
      };
      const newUser = await postUser(newUserBody);

      if (newUser) {
        login(newUser);
        navigate('/home');
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Sign up error' });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred. Please try again.' });
    }
  }, [state, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-center text-2xl font-bold mb-4">Sign up</h1>
      <form
        className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleRegister}
      >
        <input
          placeholder="Email"
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2"
        />
        <input
          placeholder="Password"
          type="password"
          value={state.password}
          onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2"
        />
        <input
          placeholder="Repeat Password"
          type="password"
          value={state.repeatPassword}
          onChange={(e) => dispatch({ type: 'SET_REPEAT_PASSWORD', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2"
        />
        {state.error && <div className="text-red-600 mb-2">{state.error}</div>}
        <Button
          type="submit"
          variant={buttonType.blue}
          classes="mb-2"
          title="Sign up"
        />
      </form>
      <div className="mt-4">
        <span className="text-gray-600">Already have an account?</span>
        <button 
          className="text-blue-600 ml-2 hover:underline"
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch({ type: 'LOGIN', payload: user }),
});

export default connect(null, mapDispatchToProps)(SignUp);