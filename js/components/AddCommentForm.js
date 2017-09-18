import React, { PropTypes } from 'react';

export let AddCommentForm = React.createClass ({
    propTypes: {
        onAddComment: PropTypes.func.isRequired,
    },
    getInitialState() {
        return {
          comments: ''
        };
    },
    handleClick() {
        const {props, state} = this;

        props.onAddComment(state.comments);
    },    
    handleCommentsChange(e) {
        this.setState({
            comments: e.target.value
        });
    },
    render() {
        const {props, state} = this;

        return ( 
            <div>
                <br/>
                <textarea type="text" value={state.comments} rows="4" cols="40" onChange={this.handleCommentsChange} />
                <button onClick={this.handleClick}>Add</button>
                <br/>
            </div>
        )
    }
})