import React, { Component } from 'react';
import './App.css';
import TodoList from './components/TodoList/TodoList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <TodoList></TodoList>
        </div>
      </div>
    );
  }
}

export default App;
