import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { buttonType } from '../constants/buttonType';

const Home = ({ userData, logged, check, logout }) => {
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <div className="text-lg font-semibold">Hello, {userData?.email}</div>
        <div className="flex">
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
      <div className="bg-white p-10 rounded-lg shadow-lg mt-16 w-full max-w-xl transform transition-transform hover:scale-105">
        <h1 className="font-bold text-4xl mb-4 text-center">About Me</h1>
        <p className="text-lg">
          Email: {userData?.email}
        </p>
        <p className="text-lg">
          Registration Date: {new Date(userData?.createdAt).toLocaleString()}
        </p>
        <Button
          variant={buttonType.gray}
          title="Go to Notes"
          classes="mt-8 w-full"
          handleClick={() => navigate('/notes')}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
