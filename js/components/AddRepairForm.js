import React, { PropTypes } from 'react';

export let AddRepairForm = React.createClass({
    propTypes: {
        onAdd: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            id: '',
            desc: '',
            date: '',
            time: '',
            assignedTo: '',
            completed: false,
            approved: false,
            comments: '',
            mode: 'Add'
        };
    },
    handleClick() {
        const {id, desc,date,time,assignedTo,completed,approved,comments} = this.state;

        var repair = {
            id: id,
            desc: desc,
            date: date,
            time: time,
            assignedTo: assignedTo,
            completed: completed,
            approved: approved,
            comments: comments
        };

        if (this.state.mode == 'Add')
            this.props.onAdd(repair);
        else
            this.props.onEdit(repair);
    },
    handleInputChange(event) {
        const target = event.target;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == 'approved')
            value = value ? 'Approved' : 'Not Approved'
        else if (name == 'completed')
            value = value ? 'Completed' : 'Not Completed'

        this.setState({
            [name]: value
        });
    },
    clear() {
        this.setState({
            id: '',
            desc: '',
            date: '',
            time: '',
            assignedTo: '',
            completed: false,
            approved: false,
            comments: '',
            mode: 'Add'
        });
    },
    edit(repair) {
        this.setState({
            id: repair.id,
            desc: repair.desc,
            date: repair.date,
            time: repair.time,
            assignedTo: repair.assignedTo,
            completed: repair.completed,
            approved: repair.approved,
            comments: repair.comments,
            mode: 'Edit'
        });
    },    
    render() {
        const {state} = this;
        return (
            <div>
                <div>
                    <br/>
                    <span>Description:</span>&nbsp;
                    <input type="text" size="20" name="desc" value={state.desc} onChange={this.handleInputChange} />&nbsp;
                    <span>Date:</span>&nbsp;
                    <input type="text" size="10" name="date" value={state.date} onChange={this.handleInputChange} />&nbsp;
                    <span>Time:</span>&nbsp;
                    <input type="text" size="10" name="time" value={state.time} onChange={this.handleInputChange} />&nbsp;
                    <br/>
                    <span>AssignedTo:</span>&nbsp;
                    <input type="text" size="10" name="assignedTo" value={state.assignedTo} onChange={this.handleInputChange} />&nbsp;
                    <span>Completed:</span>&nbsp;
                    <input type="checkbox" size="10" name="completed" checked={state.completed=='Completed'} onChange={this.handleInputChange} />&nbsp;
                    <span>Approved:</span>&nbsp;
                    <input type="checkbox" size="10" name="approved" checked={state.approved=='Approved'} onChange={this.handleInputChange} />&nbsp;
                    <br/>
                    <span>Comments:</span>&nbsp;
                    <textarea cols="40" rows="4" name="comments" value={state.comments} onChange={this.handleInputChange} />&nbsp;
                    <button onClick={this.handleClick}>{this.state.mode}</button> 
                </div>
            </div>
        )
    }
})