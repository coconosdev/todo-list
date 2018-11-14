import React, { Component } from 'react';
import './TodoList.css';
import ModifyTodoContainer from '../ModifyTodoContainer/ModifyTodoContainer'
import TodoGraph from '../TodoGraph/TodoGraph'
import History from '../History/History'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';

const SelectMinutes = (props) => {
  const long = props.type;
  let arr = [];
  if (long == 0) {
    arr = Array.from({length: 30}, (v, k) => k);
  }
  if (long == 30) {
    arr = Array.from({length: 30}, (v, k) => k+30);
  }
  if (long == 60) {
    arr = Array.from({length: 60}, (v, k) => k+60);
  }
  return (
    <select value={props.value} 
      placeholder="Minutos"
      onChange={e=>props.onHandleSelect(e)}  
      className="form-control">
        {
          arr.map((obj) => {
            return (
              <option value={obj} key={obj}>{obj} minutos</option>
            )
          })
        }
    </select>
  );
}
const SelectSeconds = (props) => {
  let arr = Array.from({length: 60}, (v, k) => k);;
  return (
    <select value={props.value} 
      placeholder="Segundos"
      onChange={e=>props.onHandleSelect(e)}  
      className="form-control">
        {
          arr.map((obj) => {
            return (
              <option value={obj} key={obj}>{obj} segundos</option>
            )
          })
        }
    </select>
  );
}

const InputsBar = (props) => {
  return (
    <div>
      <div id="myDIV" className="header">
        <div className="input-row">
          <input type="text" value={props.context.state.inputDesc}
            placeholder="Descripción..."
            className="form-control"
            onChange={e=>props.context.updateInputDesc(e)}/>
          <select value={props.context.state.optionSelected} onChange={e=>props.context.handleSelect(e)}  className="form-control">
            <option value="0">Corta: 30 min o menos</option>
            <option value="30">Media: 30 min a 1 hr</option>
            <option value="60">Larga: más de 1 hr</option>
          </select>
          <SelectMinutes type={props.context.state.optionSelected}
            onHandleSelect={props.context.handleSelectMinutes}
            value={props.context.state.totalMinutes}>
          </SelectMinutes>
          <SelectSeconds
            onHandleSelect={props.context.handleSelectSecs}
            value={props.context.state.totalSecs}>
          </SelectSeconds>
          <button
            disabled={(props.context.state.totalMinutes == 0 || props.context.state.totalSecs == 0)}
            className={(props.context.state.totalMinutes == 0 || props.context.state.totalSecs == 0) ? 'btn disabled' : 'btn btn-success'}
            onClick={props.context.newElement} >Agregar</button>
          <button
            className={'btn btn-info'}
            onClick={props.context.generateRandomTodos} >Generar</button>
          
        </div>
        <div className="input-row">
          <input type="text" value={props.context.state.inputFilter}  
              id="input-filter"
              placeholder="Filtrar tareas pendientes..."
              onChange={e=>props.context.updateInputFilter(e)}
              className="form-control"/>
        </div>
      </div>
    </div>
  );
}

class TodoList extends Component {
  constructor(props){
    super(props);
    this.state = {
      todoList: [],
      inputDesc: '',
      inputDur: '',
      totalMinutes: 0,
      totalSecs: 0,
      inputFilter: '',
      selectedIndex: 0,
      optionSelected: '0',
      selectedElement: {
        text: '',
        checked: false,
        duration: 0,
        progress: 0,
        intervalId: 0,
        action: '',
        onEdit: false,
        playProgress: function (action) {},
      },
     
    };
    this.newElement = this.newElement.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
    this.checkElement = this.checkElement.bind(this);
    this.modifyTodoDesc = this.modifyTodoDesc.bind(this);
    this.modifyTodoDur = this.modifyTodoDur.bind(this);
    this.generateRandomTodos = this.generateRandomTodos.bind(this);
    this.handleSelectMinutes = this.handleSelectMinutes.bind(this);
    this.handleSelectSecs = this.handleSelectSecs.bind(this);
  }

  newElement() {
    if (this.state.inputDesc != ''){
      const tempList = this.state.todoList;
      const totalTime = (this.state.totalMinutes * 60) + Number(this.state.totalSecs);
      tempList.push({
        text: this.state.inputDesc,
        checked: false,
        duration: Number(totalTime),
        progress: 0,
        intervalId: 0,
        action: '',
        onProgress: false,
        finishedTime: '',
        finishedDate: null,
        id: this._genId(),
        playProgress: function (action, context = null) {
          let tempList = context.state.todoList;
          this.action = action;
          const pushingProgress = () => {
            if (this.action != 'pause' && this.action != 'stop') {
              this.progress++;
              if (this.progress >= this.duration){
                this.action = 'stop';
                this.checked = true;
                this.onProgress = false;
                this.finishedTime = this.duration;
                this.finishedDate = moment().format('DD/MM/YY');
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
            this.onProgress = true;
            this.intervalId = setInterval(pushingProgress, 300);
          } 
          if (this.action == 'pause') {
            this.onProgress = false;
          }
          if (this.action == 'stop') {
            clearInterval(this.intervalId);
            this.progress = 0;
            this.checked = false;
            this.intervalId = 0;
            this.onProgress = false;
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
        optionSelected: '0',
        totalMinutes: 0,
        totalSecs: 0,
      });
    }
  }

  modifyElement(index) {
    let tempList = this.state.todoList;
    tempList[index].onEdit = true;
    this.setState({
      selectedElement: tempList[index],
      selectedIndex: index,
    });
  }

  deleteElement(index){
    let tempList = this.state.todoList;
    tempList[index].playProgress('stop', this);
    tempList[index].onEdit = false;
    tempList.splice(index, 1);
    this.setState({
      todoList: tempList,
    });
  }

  checkElement(index){
    let tempList = this.state.todoList;
    tempList[index].checked = !tempList[index].checked;
    tempList[index].onProgress = false;
    tempList[index].finishedTime = tempList[index].progress;
    tempList[index].finishedDate = moment().format('DD/MM/YY');
    tempList[index].playProgress('pause', this);
    this.setState({
      todoList: tempList,
    });
  }

  playElement(index){
    let tempList = this.state.todoList;
    let active = tempList.filter((obj)=> obj.onProgress === true);
    if (active.length > 0) return;
    tempList[index].onProgress = true;
    tempList[index].playProgress(null, this);
    this.setState({
      todoList: tempList,
    });
  }

  _calcProgressWidth(obj){
    return (obj.progress/obj.duration) * 100;
  }
  _pad(num) {
    return ("0"+num).slice(-2);
  }
  _hhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs%60;
    let hours = Math.floor(minutes/60);
    minutes = minutes%60;
    return this._pad(hours)+":"+this._pad(minutes)+":"+this._pad(secs);
  }

  _genId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateRandomTodos() {
    let tempList = [];
    let validDates = [];
   
    for (let i = 0; i < 7; i++) {
      validDates.push(moment().subtract(i,'d').format('DD/MM/YY'));
    }
    
    let randomDuration;

    for (let i = 0; i < 50; i++) {
      randomDuration = this._getRandomInt(500, 7200);
      tempList.push({
        text: 'Tarea no. ' + i,
        checked: true,
        duration: randomDuration,
        progress: 0,
        intervalId: 0,
        action: '',
        onProgress: false,
        finishedTime: '' + this._getRandomInt(Math.round(randomDuration*.8), randomDuration),
        finishedDate: validDates[this._getRandomInt(0, 6)],
        id: this._genId(),
        playProgress: function (action, context = null) {
          let tempList = context.state.todoList;
          this.action = action;
          const pushingProgress = () => {
            if (this.action != 'pause' && this.action != 'stop') {
              this.progress++;
              if (this.progress >= this.duration){
                this.action = 'stop';
                this.checked = true;
                this.onProgress = false;
                this.finishedTime = this.duration;
                this.finishedDate = moment().format('DD/MM/YY');
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
            this.onProgress = true;
            this.intervalId = setInterval(pushingProgress, 300);
          } 
          if (this.action == 'pause') {
            this.onProgress = false;
          }
          if (this.action == 'stop') {
            clearInterval(this.intervalId);
            this.progress = 0;
            this.checked = false;
            this.intervalId = 0;
            this.onProgress = false;
          }
          context.setState({
            todoList: tempList,
          });
        },
      });
    }
    this.setState({
      todoList: tempList,
    });
  }

  getList(){
    let tempList = this.state.todoList;
    const filter = this.state.inputFilter;
    tempList.sort((a, b) => {
      if (a.onProgress === true) {
        return -1;
      } else {
        return 0;
      }
    });

    if (filter != '') {
      tempList = tempList.filter((obj)=> {
        if (obj.checked == false && obj.text.toLowerCase().includes(filter.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });
    }

    return tempList.map((obj, i)=>{
      return (
        <Draggable draggableId={'draggable-'+i} index={i} key={obj.id}>
          {(provided)=>(
            <li 
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className={obj.checked ? 'checked' : null}>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: this._calcProgressWidth(tempList[i]) + '%'}}></div>
              </div>
              <span className="todo-time">
                {this._hhmmss(obj.duration - obj.progress)}
              </span>
              <span className="todo-desc" >{obj.text}</span>
              <span className="action-btn play" title="Editar tarea" data-toggle="modal" data-target="#todoModal" onClick={()=>this.modifyElement(i)}><i className="fas fa-edit"></i></span>
              <span className="action-btn edit" title="Iniciar tarea" onClick={()=>this.playElement(i)}><i className="fas fa-play"></i></span>
              <span className="action-btn pause" title="Pausar tarea" onClick={tempList[i].playProgress.bind(tempList[i], 'pause', this)}><i className="fas fa-pause-circle"></i></span>
              <span className="action-btn reset" title="Reiniciar tarea" onClick={tempList[i].playProgress.bind(tempList[i], 'restart', this)}><i className="fas fa-sync-alt"></i></span>
              <span className="action-btn cancel" title="Cancelar tarea" onClick={tempList[i].playProgress.bind(tempList[i], 'stop', this)}><i className="fas fa-stop-circle"></i></span>
              <span className="action-btn check" title="Completar tarea" onClick={()=>this.checkElement(i)}><i className="fas fa-check-circle"></i></span>
              <span className="action-btn delete" title="Eliminar tarea" onClick={()=>this.deleteElement(i)}><i className="fas fa-trash-alt"></i></span>
            </li>
          )}
        </Draggable>
      );
    });
  }

  updateInputDesc(e){
    this.setState({
      inputDesc: e.target.value
    });
  }
  updateInputFilter(e){
    this.setState({
      inputFilter: e.target.value
    });
  }

  updateInputDur(e){
    this.setState({
      inputDur: e.target.value.replace(/\D/,'')
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
      selectedElement: Object.assign({}, 
        this.state.selectedElement, 
        {duration: Number(e.target.value.replace(/\D/,''))}) 
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
    this.setState({
      optionSelected: e.target.value,
      totalMinutes: e.target.value,
    });
  }

  handleSelectMinutes(e){
    this.setState({
      totalMinutes: e.target.value,
    });
  }
  handleSelectSecs(e){
    this.setState({
      totalSecs: e.target.value,
    });
  }

  onDragEnd = result => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const tempList = this.state.todoList;
    const tempElem = tempList[source.index];
    tempList.splice(source.index, 1);
    tempList.splice(destination.index, 0, tempElem);

    this.setState({
      todoList: tempList,
    });
  }

  render() {
    return (
      <div className="app-wrapper">
        <h1>Lista de tareas</h1>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
            <a className="nav-item nav-link" id="nav-graph-tab" data-toggle="tab" href="#nav-graph" role="tab" aria-controls="nav-graph" aria-selected="false">Gráfica</a>
            <a className="nav-item nav-link" id="nav-hist-tab" data-toggle="tab" href="#nav-hist" role="tab" aria-controls="nav-hist" aria-selected="false">Historial</a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
            <InputsBar context={this}></InputsBar>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable-1">
                {(provided)=>(
                  <ul
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {this.getList()}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext> 
            <ModifyTodoContainer
              onTextChange={this.modifyTodoDesc}
              onClose={this.closeEdit}
              onDurationChange={this.modifyTodoDur}
              todo={this.state.selectedElement}>
            </ModifyTodoContainer>
          </div>
          <div className="tab-pane fade" id="nav-graph" role="tabpanel" aria-labelledby="nav-graph-tab">
            <TodoGraph graphData={this.state.todoList}></TodoGraph>
          </div>
          <div className="tab-pane fade" id="nav-hist" role="tabpanel" aria-labelledby="nav-hist-tab">
            <History tableData={this.state.todoList}></History>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoList;
