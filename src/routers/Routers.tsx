import React from "react";
import { Routes, Route } from "react-router-dom";
import routeConfig from './RouterConfig';

const Routers: React.FC = () => {
  return (
    <Routes>
      {routeConfig.lecture.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default Routers;