import React from 'react';

import {LoginManager} from './components/LoginManager';
import {UserManager} from './components/UserManager';
import {RepairManager} from './components/RepairManager';
import {UserRepairManager} from './components/UserRepairManager';

export let App = React.createClass ({
    getInitialState() {
        return {
            uname: null,
            role: null,
            token: null
        };
    },
    login(data) {
        this.setState({
            token: data.token,
            role: data.role,
            uname: data.uname
        });
    },
    logout() {
        this.setState({
            uname: null,
            role: null,
            token: null
        });
    },
    render() {
        const {role, token} = this.state;

        if (role == null) {
            return (
                <LoginManager
                    onLogin={this.login}
                    onLogout={this.logout}
                    ref={(loginManager)=> {
                        this.loginManager = loginManager;
                    }}
                />
            )
        } else if (role == 'manager') {
            return (
                <div>
                    <LoginManager
                        uname={this.state.uname}
                        role={this.state.role}
                        onLogin={this.login}
                        onLogout={this.logout}
                        ref={(loginManager)=> {
                            this.loginManager = loginManager;
                        }}
                    />
                    <UserManager
                        token={this.state.token}
                    />
                    <RepairManager
                        token={this.state.token}
                    />
                </div>
            )
        } else {
            return (
                <div>
                    <LoginManager
                        uname={this.state.uname}
                        role={this.state.role}
                        onLogin={this.login}
                        onLogout={this.logout}
                        ref={(loginManager)=> {
                            this.loginManager = loginManager;
                        }}
                    />
                    <UserRepairManager
                        token={this.state.token}
                        uname={this.state.uname}
                    />
                </div>
            )
        }
    }
})