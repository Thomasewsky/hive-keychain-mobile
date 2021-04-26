import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Separator from 'components/ui/Separator';
import {addAccount} from 'actions';
import CustomInput from 'components/form/CustomInput';
import validateNewAccount from 'utils/keyValidation';
import Background from 'components/ui/Background';
import TitleLogo from 'assets/addAccount/img_import.svg';
import UserLogo from 'assets/addAccount/icon_username.svg';
import KeyLogo from 'assets/addAccount/icon_key.svg';
import QRLogo from 'assets/addAccount/icon_scan-qr.svg';
import Button from 'components/form/EllipticButton';
import {translate} from 'utils/localize';

const AddAccountByKey = ({addAccount, navigation, route}) => {
  const [account, setAccount] = useState('');
  const [key, setKey] = useState('');
  const onImportKeys = async () => {
    try {
      const keys = await validateNewAccount(account, key);
      if (keys) {
        const wallet = route.params ? route.params.wallet : false;
        addAccount(account, keys, wallet, false);
      } else {
        Toast.show(translate('toast.error_add_account'));
      }
    } catch (e) {
      Toast.show(e.message);
    }
  };
  const {height} = useWindowDimensions();

  return (
    <Background>
      <StatusBar backgroundColor="black" />
      <View style={styles.container}>
        <Separator height={height / 7.5} />
        <TitleLogo />
        <Separator height={height / 15} />
        <Text style={styles.text}>{translate('addAccountByKey.text')}</Text>
        <Separator height={height / 15} />
        <CustomInput
          placeholder={translate('common.username').toUpperCase()}
          leftIcon={<UserLogo />}
          autoCapitalize="none"
          value={account}
          onChangeText={setAccount}
        />
        <Separator height={height / 15} />

        <CustomInput
          placeholder={translate('common.privateKey').toUpperCase()}
          autoCapitalize="characters"
          leftIcon={<KeyLogo />}
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ScanQRScreen', {wallet: true});
              }}>
              <QRLogo />
            </TouchableOpacity>
          }
          value={key}
          onChangeText={setKey}
        />
        <Separator height={height / 7.5} />
        <Button
          title={translate('common.import').toUpperCase()}
          onPress={onImportKeys}
        />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  text: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps, {addAccount})(AddAccountByKey);
