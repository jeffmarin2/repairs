import React, { PropTypes } from 'react';
import axios from 'axios';
import {Selectable} from './Selectable';
import {AddRepairForm} from './AddRepairForm';
import {RepairFilter} from './RepairFilter';

const urls = {
    'list': '/api/managers/repairs',
    'add': '/api/managers/repairs/add',
    'del': '/api/managers/repairs/del',
    'edit': '/api/managers/repairs/edit'
}

export let RepairManager = React.createClass ({
    getInitialState() {
        return {
            repairs: [],
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
                        repairs: res.data
                    })
                }
            })
    },
    componentDidMount() {
        this.fetch('list');
    },
    add(repair) {
        if (repair.desc == '' || repair.date == '' || repair.time == '')
            alert('You are missing information')
        else if (repair.approved == 'Approved') {
            alert('A repair cannot be added as already approved')
        } else {
            var dateValid = repair.date.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/i); 
            var timeValid = repair.time.match(/^([01]\d|2[0-3]):?([0-5]\d)$/i); 

            if (!timeValid)
                alert('Please enter time as HH:MM (24 hour clock)')
            else if (!dateValid)
                alert('Please enter date as YYYY-MM-DD')
            else {
                repair.completed = 'Not Completed';
                repair.approved = 'Not Approved';

                this.form.clear();
                this.fetch('add', repair);
            }
        }
    },
    edit(repair) {
        // TODO validate
        this.form.clear();
        this.fetch('edit', repair);
    },
    startEdit() {
        if (this.state.selected == -1)
            alert('Please select a repair first')
        else
            this.form.edit(this.state.repairs[this.state.selected]);
    },
    startAdd() {
        this.form.clear();
    },
    del() {
        if (this.state.selected == -1)
            alert('Please select a repair first')
        else {
            var id = this.state.repairs[this.state.selected].id;
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
    search(searchParams) {
        this.fetch('list', searchParams);
    },
    render() {
        return (
            <div>
                <h3>Repairs</h3>
                <RepairFilter
                    onSearch={this.search}
                    role='manager'
                    ref={(searchform)=> {
                        this.searchform = searchform;
                    }}
                /> 
                <button onClick={this.startAdd}>Add</button>
                <button onClick={this.startEdit}>Edit</button>
                <button onClick={this.del}>Delete</button>
                <br/>
                <br/>
                <Selectable
                    rows={this.state.repairs} 
                    selected={this.state.selected}
                    onSelect={this.select}
                />
                <AddRepairForm
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