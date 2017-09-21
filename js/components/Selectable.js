import React from 'react';

const tableStyle = { border: '1px solid black' };

export const Selectable = React.createClass({
    getInitialState() {
        return {
            selected: -1
        };
    },
    select(idx) {
        if (this.state.selected !== idx) {
            this.setState({
                selected: idx
            });
            this.props.onSelect(idx);
        }
    },
    render() {
        const { props } = this;

        return (
            <table style={tableStyle}>
                <tbody>
                    { props.rows.map((r, idx) => (
                        <tr
                            key={idx}
                            style={(this.state.selected === idx) ? { backgroundColor: 'black', color: 'white' } : null}
                            onClick={() => { this.select(idx); }}
                        >
                            { Object.keys(r).map((key, idx2) => (
                                <td key={idx2}>{r[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
});
