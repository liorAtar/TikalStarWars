import React from 'react';

const Bar = ({name, value}) => {
    return (
        <div>
            <p>{value}</p>
            <div style={{
                backgroundColor: "grey",
                width: "50px",
                height: Math.log(value / 100000) * 20,
                margin: "auto"
            }}>
            </div>
            <p>{name}</p>
        </div>
    )
};

export default Bar;
