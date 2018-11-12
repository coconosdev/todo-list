import React, { Component } from 'react';
import './History.css';
import moment from 'moment';

class History extends Component {
  render() {
    const filteredList = this.props.tableData.filter((obj) => obj.checked === true);
    function pad(num) {
      return ("0"+num).slice(-2);
    }
    function hhmmss(secs) {
      let minutes = Math.floor(secs / 60);
      secs = secs%60;
      let hours = Math.floor(minutes/60);
      minutes = minutes%60;
      return pad(hours)+":"+pad(minutes)+":"+pad(secs);
    }
    return (
      <div>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Tarea</th>
              <th>Terminado en</th>
              <th>Fecha de terminación</th>
            </tr>
          </thead>
          <tbody>
            {
              
              filteredList.map((obj) => {
                let time = hhmmss(obj.finishedTime);
                return (
                  <tr key={obj.id}>
                    <td>{obj.text}</td>
                    <td>{time}</td>
                    <td>{obj.finishedDate}</td>
                  </tr>
                )
              })   
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default History;
