import React, { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/shared/Button';
import { postNote } from '../services/api';
import { buttonType } from '../constants/buttonType';

const initialState = {
  title: '',
  text: ''
};

const reducer = (state, action) => {
  switch (action.type) {
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

const CreateNote = () => {
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();
  const userData = useSelector((state) => state.userData); 
  const logged = useSelector((state) => state.logged);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSave = async (e) => {
    e.preventDefault();

    const newNote = {
      title: state.title,
      body: state.text,
      createdAt: Date.now(),
      authorId: userData.id,
    };

    await postNote(newNote);
    dispatch({ type: 'RESET' });
    navigate('/notes');
  };

  const handleLogout = useCallback(() => {
    dispatchRedux({ type: 'LOGOUT' });
    navigate('/login');
  }, [dispatchRedux, navigate]);

  useEffect(() => {
    dispatchRedux({ type: 'CHECK' });
  }, [dispatchRedux]);

  useEffect(() => {
    if (!logged) {
      handleLogout();
    }
  }, [logged, handleLogout]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <div className="text-lg font-semibold">Hello, {userData?.email}</div>
        <div className="mb-4">
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
          <h1 className="text-2xl font-bold text-center flex-1">Create new note</h1>
        </div>
        <input
          type="text"
          placeholder="Name"
          value={state.title}
          onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
          className="bg-gray-200 p-2 rounded mb-2 w-full"
        />
        <textarea
          placeholder="Note text"
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

export default CreateNote;