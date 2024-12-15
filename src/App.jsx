import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Notes from './pages/Notes';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import ViewNote from './pages/ViewNote';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/create-note" element={<CreateNote />} />
          <Route path="/view-note/:index" element={<ViewNote />} /> 
          <Route path="/edit-note/:index" element={<EditNote />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}