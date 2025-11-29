import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Correct API endpoints
  const dealer_url = `${backendUrl}/djangoapp/get_dealers/`;
  const dealer_url_by_state = `${backendUrl}/djangoapp/get_dealerships/`;  // <-- adjust if needed

  const filterDealers = async (state) => {
    if (state === "All") {
      get_dealers();
      return;
    }

    const url = dealer_url_by_state + state + "/";
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 200) {
      setDealersList(data.dealers);
    }
  };

  const get_dealers = async () => {
    const res = await fetch(dealer_url);
    const data = await res.json();

    if (data.status === 200) {
      setDealersList(data.dealers);
    }

    // Extract states list
    const statesSet = new Set();
    data.dealers.forEach(d => statesSet.add(d.state));
    setStates([...statesSet]);
  };

  // Runs once on load
  useEffect(() => {
    get_dealers();

    // Check login
    const username = sessionStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <Header />

      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </th>

            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>

        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td><a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>

              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer.id}`}>
                    <img src={review_icon} className="review_icon" alt="Post Review" />
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;

