import React, { Component } from 'react';

class MessageList extends Component {
  boxRef = React.createRef();

  componentDidUpdate() {
    const box = this.boxRef.current;
    // scroll to bottom to make the last message visible
    box.scrollTo(0, box.scrollHeight);
  }

  render() {
    const {messages} = this.props;
    return (
      <div ref={this.boxRef} className="box" style={{height: '50vh', overflowY: 'scroll'}}>
        <table>
          <tbody>
            {messages.map(this.renderMessage.bind(this))}
          </tbody>
        </table>
      </div>
    );
  }

  renderMessage(message) {
    const {user} = this.props;
    let tag = 'tag';
    if (message.from === user) {
      tag += ' is-primary';
    }
    return (
      <tr key={message.id}>
        <td><span className={tag}>{message.from}</span></td>
        <td style={{paddingLeft: '0.75em'}}>{message.text}</td>
      </tr>
    )
  }
}

export default MessageList;
