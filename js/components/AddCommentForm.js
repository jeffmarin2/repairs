import React, { PropTypes } from 'react';

export const AddCommentForm = React.createClass({
    propTypes: {
        onAddComment: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            comments: ''
        };
    },
    handleClick() {
        this.props.onAddComment(this.state.comments);
    },
    handleCommentsChange(e) {
        this.setState({
            comments: e.target.value
        });
    },
    render() {
        return (
            <div>
                <br />
                <textarea type="text" value={this.state.comments} rows="4" cols="40" onChange={this.handleCommentsChange} />
                <button onClick={this.handleClick}>Add</button>
            </div>
        );
    }
});
