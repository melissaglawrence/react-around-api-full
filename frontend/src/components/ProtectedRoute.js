import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children, login, ...props }) => {
  return (
    <Route {...props}>{login ? children : <Redirect to={'/signIn'} />}</Route>
  );
};

export default ProtectedRoute;
