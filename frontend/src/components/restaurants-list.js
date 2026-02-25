import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = props => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchZip, setSearchZip ] = useState("");
  const [searchCuisine, setSearchCuisine ] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  };

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
    
  };

  const retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then(response => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveRestaurants();
  };

  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name")
  };

  const findByZip = () => {
    find(searchZip, "zipcode")
  };

  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine")
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Restaurant Intelligence</p>
          <h1>Choose where to eat with confidence.</h1>
          <p className="subhead">
            Browse trusted reviews, filter by cuisine, and open maps in one click.
          </p>
          <div className="hero-metrics">
            <div className="metric">
              <span className="metric-value">{restaurants.length}</span>
              <span className="metric-label">Restaurants</span>
            </div>
            <div className="metric">
              <span className="metric-value">{cuisines.length - 1}</span>
              <span className="metric-label">Cuisines</span>
            </div>
            <div className="metric">
              <span className="metric-value">Verified</span>
              <span className="metric-label">Reviews</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <h3>Find your match</h3>
          <p className="subhead">Search by name, zip, or cuisine.</p>
          <div className="search-stack">
            <div className="search-field">
              <label className="field-label" htmlFor="search-name">Restaurant name</label>
              <div className="input-group">
                <input
                  id="search-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pasta Palace"
                  value={searchName}
                  onChange={onChangeSearchName}
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={findByName}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="search-field">
              <label className="field-label" htmlFor="search-zip">Zip code</label>
              <div className="input-group">
                <input
                  id="search-zip"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10023"
                  value={searchZip}
                  onChange={onChangeSearchZip}
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={findByZip}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="search-field">
              <label className="field-label" htmlFor="search-cuisine">Cuisine</label>
              <div className="input-group">
                <select id="search-cuisine" className="form-control" onChange={onChangeSearchCuisine}>
                  {cuisines.map((cuisine) => {
                    return (
                      <option key={cuisine} value={cuisine}>
                        {cuisine.substr(0, 20)}
                      </option>
                    );
                  })}
                </select>
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={findByCuisine}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="results">
        <div className="results-header">
          <div>
            <h2>Results</h2>
            <p className="subhead">{restaurants.length} places ready for review</p>
          </div>
          <div className="results-actions">
            <button className="btn btn-outline-secondary" type="button" onClick={refreshList}>
              Reset filters
            </button>
          </div>
        </div>

        <div className="row card-grid">
          {restaurants.length === 0 && (
            <div className="empty-state">
              <h4>No matches yet</h4>
              <p>Try a different name, zip, or cuisine to expand the list.</p>
            </div>
          )}
          {restaurants.map((restaurant) => {
            const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
            return (
              <div className="col-lg-4 pb-1" key={restaurant._id}>
                <div className="card restaurant-card">
                  <div className="card-body">
                    <div className="card-top">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <span className="pill">{restaurant.cuisine}</span>
                    </div>
                    <p className="card-text">{address}</p>
                    <div className="row restaurant-actions">
                      <Link to={`/restaurants/${restaurant._id}`} className="btn btn-primary col-lg-5 mx-1 mb-1">
                        View Reviews
                      </Link>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.google.com/maps/place/${address}`}
                        className="btn btn-outline-secondary col-lg-5 mx-1 mb-1"
                      >
                        Open Map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default RestaurantsList;
