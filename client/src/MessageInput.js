import React, { Component } from 'react';

class MessageInput extends Component {
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.props.onSend(event.target.value);
      event.target.value = '';
    }
  }

  render() {
    return (
      <div className="box">
        <p className="control">
          <input className="input" type="text" placeholder="Say something..."
            onKeyPress={this.handleKeyPress.bind(this)} />
        </p>
      </div>
    );
  }
}

export default MessageInput;
