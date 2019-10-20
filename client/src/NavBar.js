import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    const {onLogout} = this.props;
    return (
      <nav className="nabar">
        <div className="navbar-end">
          <button className="button navbar-item"
            onClick={onLogout}>Logout</button>
        </div>
      </nav>
    );
  }  
}

export default NavBar;
