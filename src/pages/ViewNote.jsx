import React, { useEffect, useCallback, useMemo, useReducer } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/shared/Button';
import { getNotes, removeNote } from '../services/api';
import { buttonType } from '../constants/buttonType';

const initialState = {
  note: null,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTE':
      return { ...state, note: action.payload, loading: false };
    case 'REMOVE_NOTE':
      return { ...initialState };
    default:
      return state;
  }
};

const ViewNote = ({ userData, logged, check, logout }) => {
  const navigate = useNavigate();
  const { index } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDelete = useCallback(async () => {
    await removeNote(index);
    dispatch({ type: 'REMOVE_NOTE' });
    navigate('/notes');
  }, [index, navigate]);

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
    if (!state.loading && !state.note) {
      navigate('/notes');
    }
  }, [state, navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getNotes({ id: index });
      dispatch({ type: 'SET_NOTE', payload: notes[0] });
    };

    fetchNotes();
  }, [index]);

  const noteElement = useMemo(() => {
    if (state.loading) {
      return <div className="text-center">Loading...</div>;
    }

    if (!state.note) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <div className="text-center">Note not found</div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant={buttonType.gray}
            classes="mr-4"
            title="Back"
            handleClick={() => navigate('/notes')}
          />
          <h1 className="text-2xl font-bold">{state.note.title}</h1>
          <div className="flex space-x-4">
            <span 
              onClick={() => navigate(`/edit-note/${index}`)} 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
            >
              ✍️ {/* Иконка редактирования */}
            </span>
            <span 
              onClick={handleDelete} 
              className="cursor-pointer text-red-500 hover:text-red-700"
            >
              🗑️ {/* Иконка удаления */}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{state.note.date}</p>
        <pre className="whitespace-pre-wrap mt-4 border p-2 rounded bg-gray-50">
          {state.note.body}
        </pre>
      </div>
    );
  }, [handleDelete, index, navigate, state.loading, state.note]);

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
      {noteElement}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewNote);