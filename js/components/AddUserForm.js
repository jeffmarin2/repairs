import React, { PropTypes } from 'react';

export const AddUserForm = React.createClass({
    propTypes: {
        onAdd: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            id: '',
            uname: '',
            pwd: '',
            role: '',
            mode: 'Add'
        };
    },
    handleClick() {
        const { id, uname, pwd, role } = this.state;
        const user = {
            id,
            uname,
            pwd,
            role
        };

        if (this.state.mode === 'Add')
            this.props.onAdd(user);
        else
            this.props.onEdit(user);
    },
    handleUnameChange(e) {
        this.setState({
            uname: e.target.value
        });
    },
    handlePwdChange(e) {
        this.setState({
            pwd: e.target.value
        });
    },
    handleRoleChange(e) {
        this.setState({
            role: e.target.value
        });
    },
    clear() {
        this.setState({
            id: '',
            uname: '',
            pwd: '',
            role: '',
            mode: 'Add'
        });
    },
    edit(user) {
        this.setState({
            id: user.id,
            uname: user.uname,
            pwd: user.pwd,
            role: user.role,
            mode: 'Edit'
        });
    },
    render() {
        const { state } = this;
        return (
            <div>
                <br />
                <span>Username:</span>&nbsp;
                <input type="text" size="10" value={state.uname} onChange={this.handleUnameChange} />&nbsp;
                <span>Password:</span>&nbsp;
                <input type="text" size="10" value={state.pwd} onChange={this.handlePwdChange} />&nbsp;
                <span>Role:</span>&nbsp;
                <select value={state.role} onChange={this.handleRoleChange}>
                    <option />
                    <option>user</option>
                    <option>manager</option>
                </select>&nbsp;
                <button onClick={this.handleClick}>{this.state.mode}</button>
            </div>
        );
    }
});
