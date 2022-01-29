import React from 'react';

const Table = ({ vehiclesWithHighestSum }) => {
  return (
    <div>
      <h4>Vehicle names that have the highest sum of population for all its pilots’ home planets</h4>
      {vehiclesWithHighestSum.map(vehicle =>
        <table key={vehicle.name} style={{border: "1px solid black", borderCollapse: "collapse", margin: "auto"}}>
          <tbody>
            <tr>
              <td>
                <h5>Vehicle Name</h5>
                {vehicle.name}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black" }}>
                <h5>Vehicle Planets</h5>
                {Object.entries(vehicle.planets).map(([key, value]) =>
                  <p key={key}>{key} {value}</p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <h5>Vehicle Pilots</h5>
                {vehicle.pilots}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;