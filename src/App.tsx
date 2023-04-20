import React from 'react';
import stylesApp from './App.module.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from 'pages/home-page';
import { Layout } from 'components/layout';
import { EventPage } from 'pages/event-page';
import { RegistrationPage } from 'pages/registration-page';
import { LoginPage } from 'pages/login-page';

function App() {
  return (
    <div className={stylesApp.App}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route path="/" element={<AuthRoute />}></Route> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
