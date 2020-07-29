import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import Separator from '../../components/Separator';
import {connect} from 'react-redux';
import {addAccount} from '../../actions';
import CustomInput from '../../components/CustomInput';
import validateNewAccount from '../../utils/validateNewAccount';
import {ACCOUNT, KEY} from '../../../.env.json';
import Background from '../../components/Background';
import TitleLogo from '../../assets/addAccount/img_import.svg';
import UserLogo from '../../assets/addAccount/icon_username.svg';
import KeyLogo from '../../assets/addAccount/icon_key.svg';
import QRLogo from '../../assets/addAccount/icon_scan-qr.svg';
import Button from '../../components/EllipticButton';

const AddAccountByKey = ({addAccountConnect, navigation}) => {
  const [account, setAccount] = useState(ACCOUNT || '');
  const [key, setKey] = useState(KEY || '');
  const onImportKeys = async () => {
    const keys = await validateNewAccount(account, key);
    if (keys) {
      addAccountConnect(account, keys);
    } else {
      //TODO: show error popup
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Separator height={100} />
        <TitleLogo />
        <Separator height={50} />
        <Text style={styles.text}>Log in with your existing HIVE account</Text>
        <Separator height={50} />
        <CustomInput
          placeholder="USERNAME"
          leftIcon={<UserLogo />}
          value={account}
          onChangeText={setAccount}
        />
        <Separator height={50} />

        <CustomInput
          placeholder="PRIVATE KEY"
          leftIcon={<KeyLogo />}
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ScanQRScreen');
              }}>
              <QRLogo />
            </TouchableOpacity>
          }
          value={key}
          onChangeText={setKey}
        />
        <Separator height={100} />
      </View>
      <Button title="IMPORT" onPress={onImportKeys} />
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {display: 'flex', alignItems: 'center'},
  text: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

const mapStateToProps = (state) => {
  console.log(state);
  return state;
};
export default connect(mapStateToProps, {addAccountConnect: addAccount})(
  AddAccountByKey,
);
