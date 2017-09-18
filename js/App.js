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
        const {uname, role, token} = this.state;

        if (role == null) {
            return (
                <LoginManager
                    onLogin={this.login}
                    onLogout={this.logout}
                />
            )
        } else if (role == 'manager') {
            return (
                <div>
                    <LoginManager
                        uname={uname}
                        role={role}
                        onLogin={this.login}
                        onLogout={this.logout}
                    />
                    <UserManager 
                        token={token}
                    />
                    <RepairManager
                        token={token}
                    />
                </div>
            )
        } else if (role == 'user') {
            return (
                <div>
                    <LoginManager
                        uname={uname}
                        role={role}
                        onLogin={this.login}
                        onLogout={this.logout}
                    />
                    <UserRepairManager
                        token={token}
                        uname={uname}
                    />
                </div>
            )
        }
    }
})