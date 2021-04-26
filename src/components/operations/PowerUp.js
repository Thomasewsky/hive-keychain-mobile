import React, {useState} from 'react';
import {StyleSheet, Text, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Operation from './Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import Balance from './Balance';

import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount} from 'actions';
import {powerUp} from 'utils/hive';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';

const PowerUp = ({currency = 'HIVE', user, loadAccount}) => {
  const [to, setTo] = useState(user.account.name);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onPowerUp = async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      await powerUp(user.keys.active, {
        amount: sanitizeAmount(amount, currency),
        to: sanitizeUsername(to),
        from: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(translate('toast.powerup_success'), Toast.LONG);
    } catch (e) {
      Toast.show(`Error: ${e.message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Hp />}
      title={translate('wallet.operations.powerup.title')}>
      <Separator />
      <Balance currency={currency} account={user.account} />

      <Separator />
      <OperationInput
        placeholder={translate('common.username').toUpperCase()}
        leftIcon={<AccountLogoDark />}
        autoCapitalize="none"
        value={to}
        onChangeText={setTo}
      />
      <Separator />
      <OperationInput
        placeholder={'0.000'}
        keyboardType="decimal-pad"
        rightIcon={<Text style={styles.currency}>{currency}</Text>}
        textAlign="right"
        value={amount}
        onChangeText={setAmount}
      />

      <Separator height={40} />
      <ActiveOperationButton
        title={translate('common.send')}
        onPress={onPowerUp}
        style={styles.button}
        isLoading={loading}
      />
    </Operation>
  );
};

const getDimensionedStyles = (color) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
  });

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccount},
)(PowerUp);
