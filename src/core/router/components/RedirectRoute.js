import React from 'react';
import { Navigate } from 'react-router-dom';

export const RedirectRoute = (props) => {
    props.shouldRedirect ? <Navigate to={props.to} /> : <props.component />;
}
