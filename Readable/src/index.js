import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk'

import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'

import { Provider } from 'react-redux'

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers'

import './index.css';
import './bootstrap/css/bootstrap.css'

import createHistory from 'history/createBrowserHistory'

const history = createHistory()
const routerMid = routerMiddleware(history)

const logger = store => next => action => {
    console.group(action.type)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd(action.type)
    return result
}

reducer.route = routerReducer

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const combinedReducers = combineReducers({posts:reducer, route:routerReducer})

export const store = createStore(
    combinedReducers,
    composeEnhancers(
        applyMiddleware(logger, thunk, routerMid)
    )
)



ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}><App /></ConnectedRouter>
        </Provider>, document.getElementById('root'));
registerServiceWorker();



