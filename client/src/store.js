import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers/Reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  blacklist: ['QUESTION_SAVE'],
  storage,
}

const rootReducer = combineReducers({
  todos: reducers,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const initialState = {}

const middleware = [thunk]

const composeEnhancers = window.__REDUX_DEVTOOLIONS_EXTENS_COMPOSE__ || compose
let store = createStore(
  persistedReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware)),
)
let persistor = persistStore(store)

export { store, persistor }
