import React, { PropTypes } from 'react';

export const RepairFilter = React.createClass({
    propTypes: {
        onSearch: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            date: '',
            time: '',
            assignedTo: '',
            completed: ''
        };
    },
    handleClick() {
        const { date, time, assignedTo, completed } = this.state;

        if (date !== '') {
            const dateValid = date.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/i);
            if (!dateValid) {
                alert('Please enter date as YYYY-MM-DD');
                return;
            }
        }

        if (time !== '') {
            const timeValid = time.match(/^([01]\d|2[0-3]):?([0-5]\d)$/i);
            if (!timeValid) {
                alert('Please enter time as HH:MM (24 hour clock)');
                return;
            }
        }

        const searchParams = {
            date,
            time,
            assignedTo,
            completed
        };

        this.props.onSearch(searchParams);
    },
    handleInputChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name === 'completed')
            value = value ? 'Completed' : 'Not Completed';

        this.setState({
            [name]: value
        });
    },
    clear() {
        this.setState({
            date: '',
            time: '',
            assignedTo: '',
            completed: ''
        });
    },
    render() {
        const { state } = this;
        return (
            <div>
                <h4>Filter</h4>
                <span>Date:</span>&nbsp;
                <input type="text" size="10" name="date" value={state.date} onChange={this.handleInputChange} />&nbsp;
                <span>Time:</span>&nbsp;
                <input type="text" size="10" name="time" value={state.time} onChange={this.handleInputChange} />&nbsp;
                <span>AssignedTo:</span>&nbsp;
                <input type="text" size="10" name="assignedTo" value={state.assignedTo} onChange={this.handleInputChange} />&nbsp;
                <span>Completed:</span>&nbsp;
                <input type="checkbox" size="10" name="completed" checked={state.completed === 'Completed'} onChange={this.handleInputChange} />&nbsp;
                <button onClick={this.handleClick}>Search</button>&nbsp;
                <button onClick={this.clear}>Clear</button>
                <br />
                <br />
            </div>
        );
    }
});
