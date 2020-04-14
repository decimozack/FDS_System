import React, {useState, useEffect} from 'react';
function App() {
  const [Restaurants, setRestaurants] = useState(false);
  useEffect(() => {
    getRestaurant();
  }, []);
  function getRestaurant() {
    fetch('http://localhost:3001')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setRestaurants(data);
      });
  }
  function createRestaurant() {
    let name = prompt('Enter Restaurant name');
    let email = prompt('Enter Restaurant email');
    fetch('http://localhost:3001/Restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getRestaurant();
      });
  }
  function deleteRestaurant() {
    let id = prompt('Enter Restaurant id');
    fetch(`http://localhost:3001/Restaurants/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getRestaurant();
      });
  }
  return (
    <div>
      {Restaurants ? Restaurants : 'There is no Restaurant data available'}
      <br />
      <button onClick={createRestaurant}>Add Restaurant</button>
      <br />
      <button onClick={deleteRestaurant}>Delete Restaurant</button>
    </div>
  );
}
export default App;
