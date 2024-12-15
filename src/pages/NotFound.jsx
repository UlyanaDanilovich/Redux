import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { buttonType } from '../constants/buttonType';

const NotFound = ({ logged, check }) => {
  const navigate = useNavigate();

  useEffect(() => {
    check();
  }, [check]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-4">Page not found.</p>
      {logged ? (
        <Button
          variant={buttonType.blue}
          title="Go Home"
          handleClick={() => navigate('/home')}
        />
      ) : (
        <Button
          variant={buttonType.blue}
          title="Login"
          handleClick={() => navigate('/login')}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  logged: state.logged,
});

const mapDispatchToProps = (dispatch) => ({
  check: () => dispatch({ type: 'CHECK' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);