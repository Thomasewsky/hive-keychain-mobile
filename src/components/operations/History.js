import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';

import Operation from './Operation';
import {translate} from 'utils/localize';
import Separator from 'components/ui/Separator';
import {loadTokenHistory} from 'actions';
import HistoryIcon from 'assets/wallet/icon_history_green.svg';
import Balance from './Balance';
import Transfer from 'components/hive/Transfer';

const History = ({
  user,
  tokenBalance,
  tokenLogo,
  currency,
  history,
  loadTokenHistory,
}) => {
  useEffect(() => {
    if (user.name) {
      loadTokenHistory(user.name, currency);
    }
  }, [loadTokenHistory, user.name, currency]);

  return (
    <Operation
      logo={<HistoryIcon />}
      title={translate('wallet.operations.history')}>
      <Separator height={40} />
      <Balance
        currency={currency}
        tokenBalance={tokenBalance}
        tokenLogo={tokenLogo}
        engine
      />
      <Separator />
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => {
          return <Transfer transaction={item} user={user} token />;
        }}
      />
    </Operation>
  );
};

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      history: state.tokenHistory,
    };
  },
  {
    loadTokenHistory,
  },
)(History);
