import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './App.css';
import Table from './components/Table';

const ROOT = "https://swapi.py4e.com/api/";

// Adding docs(documentation string) to everything
// Get the vehicle with the highest sum of population
// UI
// Caching - Axioa multiple times same request
// Var / Let ? What is better?
function App() {

  const [parsedVehicles, setParsedVehicles] = useState([]);
  const [vehiclesWithHighestSum, setVehiclesWithHighestSum] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(async () => {
    if (parsedVehicles.length === 0) {
      await GetVehicles();
    }

    if (isFinished) {
      GetVehicleWithHighestSum();
    }
  }, [isFinished])

  /**
     * Get all the vehicles
     */
  const GetVehicles = async () => {
    var resVehicles = await axios.get(`${ROOT}vehicles`);

    await ParseVehicles(resVehicles.data.results);

    while (resVehicles.data.next !== null) {
      resVehicles = await axios.get(resVehicles.data.next);
      await ParseVehicles(resVehicles.data.results);
    }

    setIsFinished(true);
  }

  const ParseVehicles = async (vehicles) => {
    for (const vehicle of vehicles) {
      if (vehicle.pilots.length > 0) {
        var pilotsUrl = vehicle.pilots;
        const [pilots, planets] = await ParsePilots(pilotsUrl);

        if (pilots.length > 0) {
          var parsedVehicle = {
            "name": vehicle.name,
            "pilots": pilots,
            "planets": planets,
            "totalPopulation": SumPopulation(planets)
          };
          
          setParsedVehicles(prevValue => [...prevValue, parsedVehicle]);
        }
      }
    }
  }

  const ParsePilots = async (pilotsUrl) => {
    var pilots = [];
    var planets = {};

    // TODO: check foreach
    for (const pilotUrl of pilotsUrl) {
      var resPilot = await axios.get(pilotUrl);
      var resPlanet = await axios.get(resPilot.data.homeworld);

      var population = resPlanet.data.population;

      if (population !== "unknown") {
        pilots.push(resPilot.data.name);
        planets[resPlanet.data.name] = population;
      }
    }

    return [pilots, planets];
  }

  const SumPopulation = (planets) => {
    var sum = 0;

    Object.values(planets).forEach(population => {
      sum += parseInt(population);
    });

    return sum;
  }

  const GetVehicleWithHighestSum = () => {
    var highestSum = 0;

    parsedVehicles.forEach(vehicle => {
      if (vehicle["totalPopulation"] > highestSum) {
        highestSum = vehicle["totalPopulation"];
      }
    })

    parsedVehicles.forEach(vehicle => {
      if (vehicle["totalPopulation"] === highestSum) {
        setVehiclesWithHighestSum(prevValue => [...prevValue, vehicle]);
      }
    })
  }

  return (
    <div className="App">
      <Table vehiclesWithHighestSum={vehiclesWithHighestSum}/>
    </div>
  );
}

        // {
        //     name: mazda,
        //     pilots:[pilot1, pilot2],
        //     planets: {
        //         Mars: 8000
        //         Eath: 900
        //     }
        // }


export default App;
