import React, { Component } from 'react';
import './ModifyTodoContainer.css';

class ModifyTodoContainer extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="modifyTodo">
        <h4>Modificar tarea</h4>
        <div className="modifyTodo__row">
          <span>Nombre de la tarea:</span>
          <input type="text" id="myInput" value={this.props.todo.text}
              placeholder="Descripción..."
              className="form-control"
              onChange={e=>this.props.onTextChange(e)}/>
        </div>
        <div className="modifyTodo__row">
          <span>Duración</span>
          <input type="text" id="myInput" value={this.props.todo.duration}
              placeholder="Duración..."
              className="form-control"
              onChange={e=>this.props.onDurationChange(e)}/>
        </div>
      </div>
    );
  }
}

export default ModifyTodoContainer;
