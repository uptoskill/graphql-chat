import React, { Component } from 'react';
import { addMessage, getMessages } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

class Chat extends Component {
  state = {messages: []};

  async componentDidMount() {
    const messages = await getMessages();
    this.setState({messages});
  }

  async handleSend(text) {
    const message = await addMessage(text);
    this.setState({messages: this.state.messages.concat(message)});
  }

  render() {
    const {user} = this.props;
    const {messages} = this.state;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Chatting as {user}</h1>
          <MessageList user={user} messages={messages} />
          <MessageInput onSend={this.handleSend.bind(this)} />
        </div>
      </section>
    );
  }  
}

export default Chat;
