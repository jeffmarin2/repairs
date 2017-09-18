import React, { PropTypes } from 'react';
import axios from 'axios';

export let LoginManager = React.createClass ({
    propTypes: {
        onLogin: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            uname: '',
            pwd: ''
        };
    },
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    },    
    logout(event) {
        this.props.onLogout();
    },
    login(event) {
        var data = {
            uname: this.state.uname,
            pwd: this.state.pwd
        }

        axios.post('/api/login',data)
            .then((response) => {
                this.props.onLogin(response.data);
            })
            .catch((error) => {
                alert('User not found');
            });
    },
    register(event) {
        var data = {
            uname: this.state.uname,
            pwd: this.state.pwd
        }

        axios.post('/api/register',data)
            .then((response) => {
                this.props.onLogin(response.data);
            })
            .catch((error) => {
                alert('User already exists');
            });
    },
    render() {
        if (!this.props.uname) {
            return <div>
                Username: <input type='text' size='10' name='uname' onChange={this.handleInputChange} />
                <br/>
                Password: <input type='password' size='10' name='pwd' onChange={this.handleInputChange} />
                <br/>
                <button onClick={this.login}>Login</button>&nbsp;
                Or&nbsp;
                <button onClick={this.register}>Register</button>
            </div>;
        } else {
            return <div>
                Welcome {this.props.uname}&nbsp;&nbsp;
                Role: {this.props.role}&nbsp;&nbsp;
                <button onClick={this.logout}>Logout</button>
            </div>;
        }
    }
})