import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

const Years = ({ years }) => {
    return(
        <div>
            <ul>
                {
                    years.map( year => {
                        return (
                            <li key={ year.id }>
                                <Link to={`/years/${year.id}`}>
                                    { year.name }
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default connect(
    state=>state,
    null)(Years);