import React, { Component } from "react";
import ManagerDataService from "../services/manager.service";
import auth from "../auth";

class Home extends Component {
  constructor(props) {
    super(props);

    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);

    this.state = {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
    };
  }

  retrieveTutorials() {
    ManagerDataService.getAll()
      .then((response) => {
        // console.log(response.data.rows);
        this.setState({
          tutorials: response.data.rows,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveTutorials();
    this.setState({
      currentTutorial: null,
      currentIndex: -1,
    });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index,
    });
  }

  componentDidMount() {
    this.retrieveTutorials();
  }

  render() {
    const { tutorials, currentTutorial, currentIndex } = this.state;
    return (
      <div>
        <h4>Home</h4>
        <p>This is Home page.</p>

        <div className="col-md-6">
          <h4>User List</h4>

          <ul className="list-group">
            {tutorials &&
              tutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  key={index}
                >
                  {tutorial.userid} - {tutorial.email}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
