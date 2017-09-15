import React, { PropTypes } from 'react';
import axios from 'axios';
import {Selectable} from './Selectable';
import {AddUserForm} from './AddUserForm';

const urls = {
    'list': '/api/managers/users',
    'add': '/api/managers/users/add',
    'del': '/api/managers/users/del',
    'edit': '/api/managers/users/edit'
}

export let UserManager = React.createClass ({
    getInitialState() {
        return {
            users: [],
            selected: -1
        };
    },    
    fetch(action, data) {
        var config = {
            headers: {'x-access-token': this.props.token}
        };
        return axios
            .post(urls[action], data, config)
            .then((res) => {
                if (res.data.status == 400)
                    alert(res.data.message);
                else {
                    this.setState({
                        users: res.data
                    })
                }
            })
    },
    componentDidMount() {
        this.fetch('list', {});
    },
    add(user) {
        if (user.uname == '' || user.pwd == '' || user.role == '')
            alert('You are missing information')
        else {
            var filtered=this.state.users.filter(function(u){
                return (u.uname==user.uname);
            });

            if (filtered.length > 0)
                alert('This username already exists')
            else {
                this.form.clear();
                this.fetch('add', user);
            }
        }
    },
    edit(user) {
        if (user.uname == '' || user.pwd == '' || user.role == '')
            alert('You are missing information')
        else {
            this.form.clear();
            this.fetch('edit', user);
        }
    },
    startEdit() {
        this.form.edit(this.state.users[this.state.selected]);
    },
    startAdd() {
        this.form.clear();
    },
    del() {
        if (this.state.selected == -1)
            alert('Please select a user first')
        else {
            var id = this.state.users[this.state.selected].id;
            this.fetch('del', {
                id: id
            });
        }
    },
    select(idx) {
        this.setState({
            selected: idx
        })
    },
    render() {
        return (
            <div>
                <h3>Users</h3>
                <button onClick={this.startAdd}>Add</button>
                <button onClick={this.startEdit}>Edit</button>
                <button onClick={this.del}>Delete</button>
                <br/>
                <br/>
                <Selectable
                    rows={this.state.users} 
                    selected={this.state.selected}
                    onSelect={this.select}
                />
                <AddUserForm
                    onAdd={this.add} 
                    onEdit={this.edit}
                    ref={(form)=> {
                        this.form = form;
                    }}
                />
            </div>
        )
    }
})