import React, { useReducer, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../components/shared/Button';
import { getNotes, updateNote } from '../services/api';
import { buttonType } from '../constants/buttonType';

const initialState = {
  title: '',
  text: '',
  note: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTE':
      return {
        ...state,
        title: action.payload.title,
        text: action.payload.body,
        note: action.payload,
      };
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const EditNote = ({ userData, logged, check, logout }) => {
  const navigate = useNavigate();
  const { index } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNote = useCallback(async () => {
    const response = await getNotes({ id: index });
    const foundedNote = response[0];

    if (foundedNote) {
      dispatch({ type: 'SET_NOTE', payload: foundedNote });
    } else {
      navigate('/notes');
    }
  }, [index, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedNote = {
      ...state.note,
      title: state.title,
      body: state.text,
    };

    await updateNote(index, updatedNote);
    dispatch({ type: 'RESET' });
    navigate('/notes');
  };

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    if (!logged) {
      handleLogout();
    }
  }, [logged, handleLogout]);

  useEffect(() => {
    if (userData) {
      fetchNote();
    }
  }, [userData, fetchNote]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <div className="text-lg font-semibold">Hello, {userData?.email}</div>
        <div>
          <Button
            variant={buttonType.blue}
            classes="mr-2"
            title="Home"
            handleClick={() => navigate('/home')}
          />
          <Button
            variant={buttonType.blue}
            classes="mr-2"
            title="Notes"
            handleClick={() => navigate('/notes')}
          />
          <Button
            variant={buttonType.red}
            title="Log out"
            handleClick={handleLogout}
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <Button
            variant={buttonType.gray}
            classes="mr-4"
            title="Back"
            handleClick={() => navigate('/notes')}
          />
          <h1 className="text-2xl font-bold text-center flex-auto">Edit note</h1>
        </div>
        <input
          type="text"
          placeholder="My day"
          value={state.title}
          onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2 w-full"
        />
        <textarea
          placeholder="Today I..."
          value={state.text}
          onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-4 w-full"
        />
        <Button
          type="submit"
          variant={buttonType.green}
          classes="w-full"
          title="Save"
        />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
  logged: state.logged,
});

const mapDispatchToProps = (dispatch) => ({
  check: () => dispatch({ type: 'CHECK' }),
  logout: () => dispatch({ type: 'LOGOUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditNote);