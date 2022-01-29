import React from 'react';

const Table = ({vehiclesWithHighestSum}) => {
    return (
        <div>
            {vehiclesWithHighestSum.map(vehicle =>
                <table key={vehicle.name}>
                    <tbody>
                        <tr>
                            <td>
                                {vehicle.name}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {Object.entries(vehicle.planets).map(([key, value]) => 
                                    <p key={key}>{key} {value}</p>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
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