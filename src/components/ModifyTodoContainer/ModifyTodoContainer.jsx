import React, { Component } from 'react';
import './ModifyTodoContainer.css';

class ModifyTodoContainer extends Component {
  render() {
    return (
      <div className="modal fade" id="todoModal" tabIndex="-1" role="dialog" aria-labelledby="todoModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="todoModalLabel">Modificar tarea</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="todo-text" className="col-form-label">Nombre de la tarea:</label>
                <input type="text" id="myInput" value={this.props.todo.text}
                  placeholder="Descripción..."
                  className="form-control"
                  onChange={e=>this.props.onTextChange(e)}/>
              </div>
              <div className="form-group">
                <label htmlFor="todo-desc" className="col-form-label">Duración:</label>
                <input type="text" id="myInput" value={this.props.todo.duration}
                  placeholder="Duración..."
                  className="form-control"
                  onChange={e=>this.props.onDurationChange(e)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModifyTodoContainer;
