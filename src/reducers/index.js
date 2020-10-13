import {combineReducers} from 'redux';
import authReducer from './authReducer';
import accountsReducer from './accountsReducer';
import lastAccountsReducer from './lastAccountsReducer';
import activeAccountReducer from './activeAccountReducer';
import globalPropertiesReducer from './globalPropertiesReducer';
import bittrexReducer from './bittrexReducer';
import transactionsReducer from './transactionsReducer';
import delegationsReducer from './delegationsReducer';

export default combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  lastAccount: lastAccountsReducer,
  activeAccount: activeAccountReducer,
  properties: globalPropertiesReducer,
  bittrex: bittrexReducer,
  transactions: transactionsReducer,
  delegations: delegationsReducer,
});
