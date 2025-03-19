import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyOTP from './components/Auth/VerifyOTP';
import Editor from './components/CodeEditor/Editor';
import CodeList from './components/CodeEditor/CodeList';

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/verify-otp" component={VerifyOTP} />
                <Route path="/editor" component={Editor} />
                <Route path="/codes" component={CodeList} />
                <Route path="/" exact component={CodeList} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;