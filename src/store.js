import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';
// MAGIC STRINGS
const LOAD_YEARS = 'LOAD_YEARS';
const LOAD_POPULATIONS = 'LOAD_POPULATIONS';
const SET_VIEW = 'SET_VIEW';

// REDUCER 
const yearsReducer = (state = [], action) => {
    if(action.type === LOAD_YEARS){
        state = action.years;
    };
    return state
};
const populationsReducer = (state=[], action)=>{
    if(action.type === LOAD_POPULATIONS){
        state = action.populations;
    }
    return state;
};
const viewReducer = (state='years', action) => {
    if(action.type === SET_VIEW){
        state = action.view
    }
    return state;
}

// COMBINE REDUCER
const reducer = combineReducers({
    years: yearsReducer,
    populations: populationsReducer,
    view: viewReducer
});

// ACTION CREATOR
const _loadYears = years => ({ type: LOAD_YEARS, years });
const _loadPopulations = populations => ({ type: LOAD_POPULATIONS, populations });
const setView = view => ({ type: SET_VIEW, view });
// THUNK
const loadYears = () => {
    return async(dispatch)=>{
        const years = (await axios.get('/api/years')).data;
        dispatch(_loadYears(years));
    }
}
const loadPopulations = () => {
    return async(dispatch)=>{
        const populations = (await axios.get('/api/populations')).data;
        dispatch(_loadPopulations(populations));
    }
}

// STORE
const store = createStore(reducer, applyMiddleware(thunk, logger));

// EXPORT
export default store;
export { loadYears, loadPopulations, setView };