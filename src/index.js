import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { Switch, HashRouter as Router, Route } from 'react-router-dom';
import store, { loadYears, loadPopulations, setView } from './store';
import Years from './Years';
import Year from './Year';

const App = connect(
    ({ years }) => ({ years }),
    (dispatch)=>{
        return{
            bootstrap: async()=>{
                dispatch(loadYears())
                dispatch(loadPopulations())
            },
            setView: function(view){
                dispatch(setView(view))
            }
        }
    }
)(class App extends Component{
    componentDidMount(){
        this.props.bootstrap();
        window.addEventListener('hashchange', ()=>{
            this.props.setView(window.location.hash.slice(1));
        });
        this.props.setView(window.location.hash.slice(1));
    }
    render(){
        const { view } = this.props;
        return(
            <Router>
                <div id='yr'>
                    { view }
                    <h1>Extinction Clock</h1>
                    <p> Clicking on each year displays decreasing number of <br />
                        African Elephant's population sizes. </p>
                    <img src='ele.jpeg'></img>
                    <Years />
                    {/* <Route component={ Years } path='/years' exact /> */}
                    <Route component={ Year } path={'/years/:id'} exact />
                    {/* <Switch>
                    </Switch> */}
                </div>
            </Router>
        )
    }
})

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)