import React from 'react';
import { connect } from 'react-redux';

const Year = ({ year, population }) => {
    if(!year.id){
        return null
    }
    return(
        <div>
            Elephant population for { year.name }
            <br />
            { population.count }
        </div>
    )
};

export default connect(
    (state, otherProps)=>{
        const year = state.years.find(year => year.id === otherProps.match.params.id*1) || {};
        const population = state.populations.find( population => population.yearId === year.id ) || {};
        return { year, population };
    },
    null
)(Year);