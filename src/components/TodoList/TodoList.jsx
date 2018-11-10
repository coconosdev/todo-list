import React, { Component } from 'react';
import './TodoList.css';
import ModifyTodoContainer from '../ModifyTodoContainer/ModifyTodoContainer'

class TodoList extends Component {
  constructor(props){
    super(props);
    this.state = {
      todoList: [],
      inputDesc: '',
      inputDur: '',
      selectedElement: {
        text: '',
        checked: false,
        duration: 0,
        progress: 0,
        playProgress: function (action) {},
      },
      selectedIndex: 0,
      isCustomTime: true,
      optionSelected: 'custom',
    };
    this.newElement = this.newElement.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
    this.checkElement = this.checkElement.bind(this);
    this.modifyTodoDesc = this.modifyTodoDesc.bind(this);
    this.modifyTodoDur = this.modifyTodoDur.bind(this);
  }

  newElement() {
    if (this.state.inputDesc != '' || this.state.inputDur != ''){
      const tempList = this.state.todoList;
      tempList.push({
        text: this.state.inputDesc,
        checked: false,
        duration: Number(this.state.inputDur),
        progress: 0,
        intervalId: 0,
        action: '',
        playProgress: function (action, context = null) {
          console.log(this);
          let tempList = context.state.todoList;
          this.action = action;
          const pushingProgress = () => {
            if (this.action != 'pause' && this.action != 'stop') {
              this.progress++;
              if (this.progress >= this.duration){
                this.action = 'stop';
                this.checked = true;
                clearInterval(this.intervalId);
              }
            }
            context.setState({
              todoList: tempList,
            });
          };
          if (this.action == 'restart') {
            clearInterval(this.intervalId);
            this.progress = 0;
            this.checked = false;
            this.intervalId = 0;
          }
          if (this.intervalId == 0){
            this.intervalId = setInterval(pushingProgress, 500);
          }
          if (this.action == 'stop') {
            clearInterval(this.intervalId);
            this.progress = 0;
            this.checked = false;
            this.intervalId = 0;
          }
          context.setState({
            todoList: tempList,
          });
        },
      });
      this.setState({
        todoList: tempList,
        inputDesc: '',
        inputDur: '',
        isCustomTime: true,
        optionSelected: 'custom',
      });
    }
  }

  modifyElement(index) {
    let tempList = this.state.todoList;
    this.setState({
      selectedElement: tempList[index],
      selectedIndex: index,
    });
  }

  deleteElement(index){
    let tempList = this.state.todoList;
    tempList[index].playProgress('stop', this);
    tempList.splice(index, 1);
    this.setState({
      todoList: tempList,
    });
  }

  checkElement(index){
    let tempList = this.state.todoList;
    tempList[index].checked = !tempList[index].checked;
    this.setState({
      todoList: tempList,
    });
  }

  _calcProgressWidth(obj){
    return (obj.progress/obj.duration) * 100;
  }

  getList(){
    const tempList = this.state.todoList;
    return tempList.map((obj, i)=>{
      return (
        <li key={i} 
          className={obj.checked ? 'checked' : null}>
          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{width: this._calcProgressWidth(tempList[i]) + '%'}}></div>
          </div>
          <span className="todo-desc" onClick={()=>this.modifyElement(i)} >{obj.text}</span>
          <span className="action-btn play" title="Iniciar tarea" onClick={tempList[i].playProgress.bind(tempList[i], null, this)}><i className="fas fa-play-circle"></i></span>
          <span className="action-btn pause" title="Pausar tarea" onClick={tempList[i].playProgress.bind(tempList[i], 'pause', this)}><i className="fas fa-pause-circle"></i></span>
          <span className="action-btn reset" title="Reiniciar tarea" onClick={tempList[i].playProgress.bind(tempList[i], 'restart', this)}><i className="fas fa-sync-alt"></i></span>
          <span className="action-btn cancel" title="Cancelar tarea" onClick={tempList[i].playProgress.bind(tempList[i], 'stop', this)}><i className="fas fa-stop-circle"></i></span>
          <span className="action-btn check" title="Completar tarea" onClick={()=>this.checkElement(i)}><i className="fas fa-check-circle"></i></span>
          <span className="action-btn delete" title="Eliminar tarea" onClick={()=>this.deleteElement(i)}><i className="fas fa-trash-alt"></i></span>
        </li>
      );
    });
  }

  updateInputDesc(e){
    this.setState({
      inputDesc: e.target.value
    });
  }

  updateInputDur(e){
    this.setState({
      inputDur: e.target.value
    });
  }

  modifyTodoDesc(e){
    this.setState({
      selectedElement: Object.assign({}, this.state.selectedElement, {text: e.target.value}) 
    }, () => {
      this.updateList();
    });
  }

  modifyTodoDur(e){
    this.setState({
      selectedElement: Object.assign({}, this.state.selectedElement, {duration: Number(e.target.value)}) 
    }, () => {
      this.updateList();
    });
  }

  updateList(){
    this.deleteElement(this.state.selectedIndex);
    let tempList = this.state.todoList;
    tempList.splice(this.state.selectedIndex,0,this.state.selectedElement);
    this.setState({
      todoList: tempList,
    });
  }

  handleSelect(e) {
    if (e.target.value == 'custom') {
      this.setState({
        isCustomTime: true,
        inputDur: 0,
      });
    } else {
      this.setState({
        isCustomTime: false,
      });
    }
    if (e.target.value == '1') {
      this.setState({
        inputDur: this._getRandomInt(1, 1800),
      });
    }
    if (e.target.value == '2') {
      this.setState({
        inputDur: this._getRandomInt(1800, 3600),
      });
    }
    if (e.target.value == '3') {
      this.setState({
        inputDur: this._getRandomInt(3600, 7200),
      });
    }
    this.setState({
      optionSelected: e.target.value,
    });
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  componentDidMount(){
    let diarrea = {
      text: '',
      checked: false,
      duration: 100,
      progress: 24,
      playProgress: function (action) {
        const pushingProgress = () => {
          if (action != 'pause' && action != 'stop') {
            this.progress++;
            if (this.progress == this.duration){
              action = 'stop';
              this.checked = true;
            }
          }
        };
        const interval = setInterval(pushingProgress, 100);
        if (action == 'stop') {
          clearInterval(interval);
          this.progress = 0;
          this.checked = false;
        }
      }
    };
    diarrea.playProgress();
  }

  render() {
    return (
      <div>
        <div id="myDIV" className="header">
          <h2>Lista de tareas</h2>

          <div className="input-row">
            <input type="text" id="myInput" value={this.state.inputDesc}
              placeholder="Descripción..."
              className="form-control"
              onChange={e=>this.updateInputDesc(e)}/>
            <select value={this.state.optionSelected} onChange={e=>this.handleSelect(e)}  className="form-control">
              <option value="1">Corta: 30 min o menos</option>
              <option value="2">Media: 30 min a 1 hr</option>
              <option value="3">Larga: más de 1 hr</option>
              <option value="custom">Personalizado</option>
            </select>
            <input type="text" id="myInput" value={this.state.inputDur}
              disabled={!this.state.isCustomTime}
              placeholder="Duración..."
              className="form-control"
              onChange={e=>this.updateInputDur(e)}/>
            <button
              className={(this.state.inputDesc == '' || this.state.inputDur == '') ? 'btn disabled' : 'btn btn-success'}
              onClick={this.newElement} >Agregar</button>
          </div>
        </div>
        <ul id="myUL">
          {this.getList()}
        </ul>
        {
          this.state.selectedElement && 
          <ModifyTodoContainer
            onTextChange={this.modifyTodoDesc}
            onDurationChange={this.modifyTodoDur}
            todo={this.state.selectedElement}>
          </ModifyTodoContainer>
        }
      </div>
    );
  }
}

export default TodoList;
