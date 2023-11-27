import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {showFloatingBar} from 'actions/floatingBar';
import {forgetRequestedOperation} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import Bridge from 'components/bridge';
import {MessageModal} from 'components/modals/MessageModal';
import {getToggleElement} from 'hooks/toggle';
import MainDrawer from 'navigators/MainDrawer';
import SignUpStack from 'navigators/SignUp';
import UnlockStack from 'navigators/Unlock';
import React, {useEffect, useRef, useState} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import Orientation from 'react-native-orientation-locker';
import {ConnectedProps, connect} from 'react-redux';
import Modal from 'screens/Modal';
import {FloatingBar} from 'screens/hive/wallet/FloatingBar';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {setRpc} from 'utils/hive';
import {processQRCodeOp} from 'utils/hive-uri';
import setupLinking, {clearLinkingListeners} from 'utils/linking';
import {modalOptions, noHeader, setNavigator} from 'utils/navigation';
import {ModalNavigationRoute, RootStackParam} from './navigators/Root.types';

const Root = createStackNavigator<RootStackParam>();

const App = ({
  hasAccounts,
  auth,
  rpc,
  accounts,
  requestedOp,
  forgetRequestedOperation,
  showFloatingBar,
}: PropsFromRedux) => {
  let routeNameRef: React.MutableRefObject<string> = useRef();
  let navigationRef: React.MutableRefObject<NavigationContainerRef> = useRef();
  const [currentRouteName, setCurrentRouteName] = useState('');

  useEffect(() => {
    setupLinking();
    RNBootSplash.hide({fade: true});
    Orientation.lockToPortrait();
    return () => {
      clearLinkingListeners();
    };
  }, []);

  useEffect(() => {
    if (accounts.length && requestedOp) {
      processQRCodeOp(requestedOp);
      forgetRequestedOperation();
    }
  }, [accounts, requestedOp]);

  useEffect(() => {
    setRpc(rpc as Rpc);
  }, [rpc]);

  const renderNavigator = () => {
    if (!hasAccounts) {
      // No accounts, sign up process
      return <SignUpStack />;
    } else if (!auth.mk) {
      // has account but not authenticated yet -> Unlock
      return <UnlockStack />;
    } else {
      return <MainDrawer />;
    }
  };

  const renderRootNavigator = () => {
    return (
      <Root.Navigator>
        <Root.Screen
          name="Main"
          component={renderNavigator}
          options={noHeader}
        />
        <Root.Screen name="ModalScreen" component={Modal} {...modalOptions} />
      </Root.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={(navigator) => {
        setNavigator(navigator);
        navigationRef.current = navigator;
      }}
      onReady={() => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        logScreenView(currentRouteName);
      }}
      onStateChange={async (state) => {
        let currentRouteName = navigationRef.current.getCurrentRoute().name;
        setCurrentRouteName(currentRouteName);
        const p = navigationRef.current.getCurrentRoute().params;
        if (currentRouteName === 'WalletScreen') {
          currentRouteName = getToggleElement() || 'WalletScreen';
        }
        if (currentRouteName === 'ModalScreen' && !!p) {
          currentRouteName = 'ModalScreen_' + (p as ModalNavigationRoute).name;
        }
        logScreenView(currentRouteName);
      }}>
      {renderRootNavigator()}
      <MessageModal capitalize />
      <FloatingBar currentRouteName={currentRouteName} />
      <Bridge />
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
    rpc: state.settings.rpc,
    accounts: state.accounts,
    requestedOp: state.hiveUri.operation,
  };
};

const connector = connect(mapStateToProps, {
  forgetRequestedOperation,
  showFloatingBar,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
