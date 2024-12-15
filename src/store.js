import { createStore } from 'redux';

const initialState = {
  userData: null,
  logged: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      localStorage.setItem('userData', JSON.stringify(action.payload));
      return { ...state, userData: action.payload, logged: true };
    }
    case 'CHECK': {
      let user;
      try {
        user = JSON.parse(localStorage.getItem('userData'));
      } catch (error) {
        console.log('Error parsing JSON:', error);
        user = null;
      }
      return { ...state, userData: user, logged: !!user };
    }
    case 'LOGOUT': {
      localStorage.removeItem('userData');
      return { ...state, userData: null, logged: false  };
    }
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;