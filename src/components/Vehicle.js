import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ROOT = "https://swapi.py4e.com/api/"

const Vehicle = () => {

    const [allVehicle, setAllVehicle] = useState([])
    const [sumPopulationByVehicle, setSumPopulationByVehicle] = useState([])

    useEffect(() => {
        GetAllVehiclesWithPilots()
    })

    const addVehicle = (response) => {
        response.data.results.map(vehicle => {
            if (vehicle.pilots.length > 0) {
                getVehiclePilots(vehicle)
                allVehicle.push(vehicle)
            }
        });
    }

    const GetAllVehiclesWithPilots = async () => {
        // Fetch the first page of starships
        var response = await axios.get(`${ROOT}vehicles`);
        console.log(response.data)

        // Add the starships to list
        addVehicle(response);

        // Check while there is a next page
        while (response.data.next !== null) {
            // Fetch the next page starships
            response = await axios.get(response.data.next);
            // Add the starships to the list
            addVehicle(response);
        }

        console.log("allVehicle", allVehicle);
        console.log(sumPopulationByVehicle)
    }

    const getVehiclePilots = async (vehcile) => {
        var vehiclePopulation = []
        vehcile.pilots.map(async pilot => {
            var response_of_pilot = await axios.get(pilot)
            var response_of_homeworld = await axios.get(response_of_pilot.data.homeworld)

            if (parseInt(response_of_homeworld.data.population)) {                
                vehiclePopulation.push(parseInt(response_of_homeworld.data.population))
            }
        })

        sumPopulationByVehicle.push([vehcile.name, vehiclePopulation])
    }

  return <div></div>;
};

export default Vehicle;