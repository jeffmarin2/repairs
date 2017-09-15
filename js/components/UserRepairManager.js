import React, { PropTypes } from 'react';
import axios from 'axios';
import {Selectable} from './Selectable';
import {AddRepairForm} from './AddRepairForm';
import {RepairFilter} from './RepairFilter';

const urls = {
    'list': '/api/users/repairs/',
    'complete': '/api/users/repairs/complete/'
}

export let UserRepairManager = React.createClass ({
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
        var url = urls[action] + this.props.uname;

        return axios
            .post(url, data, config)
            .then((res) => {
                this.setState({
                    repairs: res.data
                })
            })
    },
    componentDidMount() {
        this.fetch('list');
    },
    complete() {
        if (this.state.selected == -1)
            alert('Please select a repair first')
        else if (this.state.repairs[this.state.selected].completed == 'Completed')
            alert('This repair has already been completed')
        else {
            var repairid = this.state.repairs[this.state.selected].id;
            this.fetch('complete', {
                repairid: repairid
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
                <h3>Repairs Assigned To {this.props.uname}</h3>
                <RepairFilter
                    onSearch={this.search}
                    role='user'
                    ref={(searchform)=> {
                        this.searchform = searchform;
                    }}
                /> 
                <button onClick={this.complete}>Complete</button>
                <br/>
                <br/>
                <Selectable
                    rows={this.state.repairs} 
                    selected={this.state.selected}
                    onSelect={this.select}
                />
            </div>
        )
    }
})