import React, { Component } from 'react';
import './TodoGraph.css';
import {Bar} from 'react-chartjs-2';
import moment from 'moment';

class TodoGraph extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const filteredList = this.props.graphData.filter((obj) => obj.checked === true);

    const labelDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    let newLabels = filteredList.map((obj)=>{
      return obj.text;
    });

    let newData = [];
    filteredList.forEach((obj) => {
      newData.push(obj.finishedTime);
    });

    const pureBgArray = ['#DC3522', '#0B486B' , '#27ae60', '#8e44ad', '#f1c40f', '#4A6266', '#A84B05']

    const bgArray = filteredList.map((obj)=>{
      let day = moment(obj.finishedDate, 'DD/MM/YY').isoWeekday() -1;
      return pureBgArray[day];
    });

    const data = {
      labels: newLabels,
      datasets: [{
        label: 'Duración',
        data: newData,
        backgroundColor: bgArray,
      }],
    };

    const options = {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    
    return (
      <div>
        <div className="graph-info">
          {
            labelDays.map((obj, i)=>{
              return (
                <div key={i} style={{backgroundColor: pureBgArray[i]}}>
                  {obj}
                </div>
              )
            })
          }
        </div>
        <Bar
          data={data}
          options={options}
        />
      </div>
    );
  }
}

export default TodoGraph;
