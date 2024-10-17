import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import "@fontsource/roboto";

// Pages
import Login from "./components/login/Login";
import Error404 from "./components/error/Page404";
import NavBar from "./components/layout/NavBar";
import Dashboard from "./components/dashboard/Dashboard";
import Management from "./components/users/Management";
import Profile from "./components/profile/Profile";
import QuestionsBank from "./components/questions/Management";
import Struct from "./components/structs/Management";
import Population from "./components/populations/Management";
import Census from "./components/census/Management";
import Surveys from "./components/surveys/Management";
import UserCensus from "./components/census/render/userCensus";
import UserSurvey from "./components/surveys/render/userSurvey";
import Studies from "./components/studies/Management";
import Blog from "./components/blog/blog";
import Entry from "./components/blog/post/pages/Study/view";
//import Credits from "./components/blog/post/pages/Credits/Credits";
// import Blog2 from "./components/blog2/Blog";

import "./App.css";
import "survey-creator-core/survey-creator-core.i18n";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";

import './customTraslation.ts'

const RequireAuth = ({ children, redirectTo, isAuthenticated }) => {
  return isAuthenticated ? (
    <div style={{ display: "flex", position: "relative" }}>
      <NavBar />
      {children}
    </div>
  ) : (
    <Navigate to={redirectTo} />
  );
};

const RequireAuthLogin = ({ children, redirectTo, isAuthenticated }) => {
  return isAuthenticated ? (
    <div style={{ display: "flex", position: "relative" }}>
      {children}
    </div>
  ) : (
    <Navigate to={redirectTo} />
  );
};

const App = () => {
  const todos = useSelector((state) => state.todos);

  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Blog />} />
        <Route path="/entry" element={<Entry />} />
        {/* <Route path="/credits" element={<Credits />} /> */}
        <Route
          path="/login"
          element={
            <RequireAuthLogin
              redirectTo="/dashboard"
              isAuthenticated={!todos.auth}
            >
              <Login name="Login Page" />
            </RequireAuthLogin>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth
              redirectTo={todos.userInfo && todos.userInfo.role.alias !== 'ADM' ? '/dashboard' : '/'}
              isAuthenticated={todos !== null && todos.userInfo && todos.userInfo.role.alias === 'ADM' ? todos.auth : false}
            >
              <Management />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/questions"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <QuestionsBank />
            </RequireAuth>
          }
        />
        <Route
          path="/structs"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Struct />
            </RequireAuth>
          }
        />
        <Route
          path="/populations"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Population />
            </RequireAuth>
          }
        />
        <Route
          path="/census"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Census />
            </RequireAuth>
          }
        />
        <Route
          path="/surveys"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Surveys />
            </RequireAuth>
          }
        />
        <Route
          path="/studies"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Studies />
            </RequireAuth>
          }
        />
        {/* <Route
          path="/credits"
          element={
            <RequireAuth
              redirectTo="/"
              isAuthenticated={todos !== null ? todos.auth : false}
            >
              <Credits />
            </RequireAuth>
          }
        /> */}
        {/* <Route path="/blog2" element={<Blog2 name="blog" />} /> */}
        <Route path="/censusForm" element={<UserCensus name="Responder censo" />} />
        <Route path="/surveyForm" element={<UserSurvey name="Responder encuesta" />} />
        <Route path="*" element={<Error404 name="Error 404 Page" />} />
      </Routes>
    </Router>
  );
};

export default App;
