import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ROOT = "https://swapi.py4e.com/api/"

const VehicleTable = () => {

    const [allVehicle, setAllVehicle] = useState([])
    const [allPilots, setAllPilots] = useState({})
    const [allPlantes, setAllPlantes] = useState({})
    const [vehicles, setVehicles] = useState({})

    useEffect(() => {
        GetAllVehiclesWithPilots()
    })

    const addVehicle = (response) => {
        response.data.results.map(vehicle => {
            if (vehicle.pilots.length > 0) {
                allVehicle.push(vehicle)
            }
        });
    }

    const GetAllVehiclesWithPilots = async () => {
        // Fetch the first page of starships
        try {
            
            var response = await axios.get(`${ROOT}vehicles`);
            console.log(response.data)
            
            // Add the starships to list
            addVehicle(response);
        } catch (error) {
            console.log(error)
        }

        // Check while there is a next page
        while (response.data.next !== null) {
            try {
                
                // Fetch the next page starships
                response = await axios.get(response.data.next);
                // Add the starships to the list
                addVehicle(response);
            } catch (error) {
                console.log(error)
            }
        }

        GetEachVehiclePilots()

        console.log("allVehicle", allVehicle);
    }

    const GetEachVehiclePilots = async () => {
        
        allVehicle.map(vehicle => {
                var response_of_pilot = ""
                var response_of_homeworld = ""
                var pilotNames = []
                var planets = {}
                
                vehicle.pilots.map(async pilot => {
                    var new_pilot_name = ""
                    var new_planet = {}
                    
                    // Check if the current pilot was not found already
                    if (!(pilot in allPilots)) {
                        // Fetch the current pilot
                        try {
                            
                            response_of_pilot = await axios.get(pilot)
                            
                            // Add the current pilot to all the pilots list
                            allPilots[pilot] = response_of_pilot.data.name;
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    
                    new_pilot_name = allPilots[pilot]
                    
                    // Check if the current pilot homeworld was not found already
                    if (!(response_of_pilot.data.homeworld in allPlantes)) {
                        // Fetch the current pilot homeworld
                        try {
                            
                            response_of_homeworld = await axios.get(response_of_pilot.data.homeworld)
                            
                            // Add the current pilot plante info to all the planets list
                            allPlantes[response_of_pilot.data.homeworld] = {
                                "name": response_of_homeworld.data.name,
                                "population": response_of_homeworld.data.population
                            };
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    
                new_planet = {
                    "name": allPlantes[response_of_pilot.data.homeworld]["name"],
                    "population": allPlantes[response_of_pilot.data.homeworld]["population"]
                }

                // Add the current pilot to the current starship pilots list
                pilotNames.push(new_pilot_name)
                planets[new_planet.name] = new_planet.population
            })

            // Add the current starship info with all of its pilots to the starships list
            vehicles[vehicle.name] = { "pilots": pilotNames, "planets": planets }
        })

        console.log(vehicles)
        console.log(allVehicle)

        allVehicle.forEach(vehicle => {
            var v = vehicles[vehicle.name]
            var x = v["planets"]

            if (typeof (x) === Promise) {
                console.log("x is promise")
            }
            console.log(Object.values(x))
            console.log(x)
            console.log(Object.entries(x))
        })
    }

    return (
        <div>
            <h1>Star Wars</h1>
        </div>
    );
};

export default VehicleTable