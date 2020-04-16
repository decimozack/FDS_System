import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class WorkSchedule extends Component {
	constructor(props) {
    super(props);

    let empty = Array(12).fill(false);

    this.state = {
      id : auth.getUser().userid,
      workshift : {
        monday: empty,
        tuesday: empty,
        wednesday: empty,
        thursday: empty,
        friday: empty,
        saturday: empty,
        sunday: empty,
      },
      message: ""
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    let url = config.backend_url + "/rider/getRiderWWS/" + this.state.id;
    axios.get(url)
    .then(res => {
      const workshift = res.data;
      if (workshift.length) {
        this.setState({
          workshift : workshift[0]
        });
      } 
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleClick(day, time) {
    let copyWorkshift = {...this.state.workshift}
    let copyDay = {...copyWorkshift[day]}
    copyDay[time] = !copyDay[time];
    copyWorkshift[day] = copyDay;
    this.setState({workshift:copyWorkshift})
  }

  handleUpdate() {
    let url = config.backend_url + "/rider/updateRiderWWS";
    console.log(this.state.workshift);
    axios.post(url, {id: this.state.id, shift: this.state.workshift})
    .then(res => {
      this.setState({message: res.data})

      let url = config.backend_url + "/rider/getRiderWWS/" + this.state.id;
      return axios.get(url)
    })
    .then(res => {
      const workshift = res.data;
      if (workshift.length) {
        this.setState({
          workshift : workshift[0]
        });
      } 
    })
    .catch(err => {
      this.setState({message: "Error: Failed to update workshift, Invalid workshift, or Insufficient riders"})
    })

  }

  render() {
    const data = [{
      day: 'monday',
      h1: 'h1'
    }]
    const columns = [{
      Header: 'Day',
      accessor: 'day'
    },{
      Header: 'h1',
      accessor: 'h1'
    }]
    console.log(this.state.workshift)
    return (
      <div>
        <h3>Work Shift</h3>
        <div>
        <Button onClick={this.handleUpdate}>Update Workshift</Button>
        </div>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        </div>
        <Table id="tableID">
      <thead>
        <tr>
          <th>Day</th>
          <th>10-11</th>
          <th>11-12</th>
          <th>12-13</th>
          <th>13-14</th>
          <th>14-15</th>
          <th>15-16</th>
          <th>16-17</th>
          <th>17-18</th>
          <th>18-19</th>
          <th>19-20</th>
          <th>20-21</th>
          <th>21-22</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Monday</th>
          <td onClick={() => this.handleClick('monday', 'h1')}>{this.state.workshift.monday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h2')}>{this.state.workshift.monday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h3')}>{this.state.workshift.monday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h4')}>{this.state.workshift.monday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h5')}>{this.state.workshift.monday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h6')}>{this.state.workshift.monday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h7')}>{this.state.workshift.monday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h8')}>{this.state.workshift.monday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h9')}>{this.state.workshift.monday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h10')}>{this.state.workshift.monday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h11')}>{this.state.workshift.monday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('monday', 'h12')}>{this.state.workshift.monday.h12 ? 'T' : '_'}</td>
        </tr>
        <tr>
          <th scope="row">Tuesday</th>
          <td onClick={() => this.handleClick('tuesday', 'h1')}>{this.state.workshift.tuesday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h2')}>{this.state.workshift.tuesday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h3')}>{this.state.workshift.tuesday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h4')}>{this.state.workshift.tuesday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h5')}>{this.state.workshift.tuesday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h6')}>{this.state.workshift.tuesday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h7')}>{this.state.workshift.tuesday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h8')}>{this.state.workshift.tuesday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h9')}>{this.state.workshift.tuesday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h10')}>{this.state.workshift.tuesday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h11')}>{this.state.workshift.tuesday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('tuesday', 'h12')}>{this.state.workshift.tuesday.h12 ? 'T' : '_'}</td>
        </tr>
        <tr>
          <th scope="row">Wednesday</th>
          <td onClick={() => this.handleClick('wednesday', 'h1')}>{this.state.workshift.wednesday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h2')}>{this.state.workshift.wednesday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h3')}>{this.state.workshift.wednesday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h4')}>{this.state.workshift.wednesday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h5')}>{this.state.workshift.wednesday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h6')}>{this.state.workshift.wednesday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h7')}>{this.state.workshift.wednesday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h8')}>{this.state.workshift.wednesday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h9')}>{this.state.workshift.wednesday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h10')}>{this.state.workshift.wednesday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h11')}>{this.state.workshift.wednesday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('wednesday', 'h11')}>{this.state.workshift.wednesday.h12 ? 'T' : '_'}</td>
        </tr>
        <tr>
          <th scope="row">Thursday</th>
          <td onClick={() => this.handleClick('thursday', 'h1')}>{this.state.workshift.thursday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h2')}>{this.state.workshift.thursday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h3')}>{this.state.workshift.thursday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h4')}>{this.state.workshift.thursday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h5')}>{this.state.workshift.thursday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h6')}>{this.state.workshift.thursday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h7')}>{this.state.workshift.thursday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h8')}>{this.state.workshift.thursday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h9')}>{this.state.workshift.thursday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h10')}>{this.state.workshift.thursday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h11')}>{this.state.workshift.thursday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('thursday', 'h12')}>{this.state.workshift.thursday.h12 ? 'T' : '_'}</td>
        </tr>
        <tr>
          <th scope="row">Friday</th>
          <td onClick={() => this.handleClick('friday', 'h1')}>{this.state.workshift.friday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h2')}>{this.state.workshift.friday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h3')}>{this.state.workshift.friday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h4')}>{this.state.workshift.friday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h5')}>{this.state.workshift.friday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h6')}>{this.state.workshift.friday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h7')}>{this.state.workshift.friday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h8')}>{this.state.workshift.friday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h9')}>{this.state.workshift.friday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h10')}>{this.state.workshift.friday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h11')}>{this.state.workshift.friday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('friday', 'h12')}>{this.state.workshift.friday.h12 ? 'T' : '_'}</td>
        </tr>
        <tr>
          <th scope="row">Saturday</th>
          <td onClick={() => this.handleClick('saturday', 'h1')}>{this.state.workshift.saturday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h2')}>{this.state.workshift.saturday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h3')}>{this.state.workshift.saturday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h4')}>{this.state.workshift.saturday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h5')}>{this.state.workshift.saturday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h6')}>{this.state.workshift.saturday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h7')}>{this.state.workshift.saturday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h8')}>{this.state.workshift.saturday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h9')}>{this.state.workshift.saturday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h10')}>{this.state.workshift.saturday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h11')}>{this.state.workshift.saturday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('saturday', 'h12')}>{this.state.workshift.saturday.h12 ? 'T' : '_'}</td>
        </tr>
        <tr>
          <th scope="row">Monday</th>
          <td onClick={() => this.handleClick('sunday', 'h1')}>{this.state.workshift.sunday.h1 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h2')}>{this.state.workshift.sunday.h2 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h3')}>{this.state.workshift.sunday.h3 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h4')}>{this.state.workshift.sunday.h4 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h5')}>{this.state.workshift.sunday.h5 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h6')}>{this.state.workshift.sunday.h6 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h7')}>{this.state.workshift.sunday.h7 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h8')}>{this.state.workshift.sunday.h8 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h9')}>{this.state.workshift.sunday.h9 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h10')}>{this.state.workshift.sunday.h10 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h11')}>{this.state.workshift.sunday.h11 ? 'T' : '_'}</td>
          <td onClick={() => this.handleClick('sunday', 'h12')}>{this.state.workshift.sunday.h12 ? 'T' : '_'}</td>
        </tr>
      </tbody>
    </Table>
      </div>
    );
  }
}

export default WorkSchedule;
