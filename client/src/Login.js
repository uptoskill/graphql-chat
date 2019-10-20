import React, { Component } from 'react';
import { login } from './auth';

class Login extends Component {
  state = {name: '', password: '', error: false};

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {name, password} = this.state;
    const user = await login(name, password);
    if (user) {
      this.props.onLogin(user);
    } else {
      this.setState({error: true});
    }
  }

  render() {
    const {name, password, error} = this.state;
    return (
      <div>
        <section className="section">
          <div className="container">
            <h1 className="title">Chat Login</h1>
            <form>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input className="input" type="text" name="name" value={name}
                    onChange={this.handleChange.bind(this)} />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" name="password" value={password}
                    onChange={this.handleChange.bind(this)} />
                </div>
              </div>
              <div className="field">
                {error &&
                  <p className="help is-danger">Invalid Credentials</p>
                }                
                <div className="control">
                  <button className="button is-link"
                    onClick={this.handleSubmit.bind(this)}>Login</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default Login;
