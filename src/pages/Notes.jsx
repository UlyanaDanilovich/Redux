import React, { useEffect, useReducer, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { getNotes, removeNote } from '../services/api';
import { buttonType } from '../constants/buttonType';

const initialState = {
  notes: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false };
    case 'REMOVE_NOTE':
      return { ...state, notes: state.notes.filter(note => note.id !== action.payload) };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const Notes = ({ userData, logged, check, logout }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNotes = async (id) => {
    try {
      const response = await getNotes({ authorId: id });
      dispatch({ type: 'SET_NOTES', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notes' });
    }
  };

  const handleDelete = useCallback(async (noteId) => {
    if (userData) {
      await removeNote(noteId);
      dispatch({ type: 'REMOVE_NOTE', payload: noteId });
    }
  }, [userData]);

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
      fetchNotes(userData.id);
    }
  }, [userData]);

  const list = useMemo(() => {
    if (state.loading) {
      return <div className="text-center">Loading...</div>;
    }

    if (state.notes.length === 0) {
      return <div className="text-center">No notes</div>;
    }

    return state.notes.map((note) => (
      <div 
        key={note.id} 
        className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer flex justify-between items-center" 
        onClick={() => navigate(`/view-note/${note.id}`)}
      >
        <div className="flex-grow">
          <h2 className="font-bold">{note.title}</h2>
          <p className="text-sm text-gray-600">{new Date(note.createdAt).toLocaleDateString('en-US')}</p>
        </div>
        <div className="flex ml-4">
          <button 
            className="text-red-500 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(note.id);
            }} 
          >
            🗑️ {/* Иконка удаления */}
          </button>
          <button 
            className="text-blue-500"
            onClick={(e) => { 
              e.stopPropagation();
              navigate(`/edit-note/${note.id}`);
            }} 
          >
            ✍️ {/* Иконка редактирования */}
          </button>
        </div>
      </div>
    ));
  }, [handleDelete, navigate, state.notes, state.loading]);

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
            variant={buttonType.red}
            title="Log out"
            handleClick={handleLogout}
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <Button
        variant={buttonType.green}
        classes="mb-4"
        title="Add new note"
        handleClick={() => navigate('/create-note')}
      />
      <div className="w-full max-w-4xl">
        {list}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Notes);