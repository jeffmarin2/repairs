import React from 'react';

const tableStyle = {border: '1px solid black'};

export let Selectable = React.createClass ({
    getInitialState() {
        return {
          selected: -1
        };
    },
    select(idx) {
        if (this.state.selected !== idx) {
            this.setState({
                selected: idx
            })
            this.props.onSelect(idx);
        }
    },
    render() {
        const {props, state} = this;

        return (
            <table style={tableStyle}>
                <tbody>
                    {props.rows.map((r,idx)=> {
                        return (
                            <tr key={idx}
                                style={(this.state.selected === idx)?{backgroundColor:'black',color:'white'}:null}
                                onClick={()=>{this.select(idx);}}>
                                {Object.keys(r).map((key, idx) => {
                                return (
                                    <td key={idx}>{r[key]}</td>
                                );
                            })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }
})