import {ActiveAccount} from 'actions/interfaces';
import CurrencySavingDark from 'assets/new_UI/currency-saving-dark.svg';
import CurrencySavingLight from 'assets/new_UI/currency-saving-light.svg';
import Icon from 'components/hive/Icon';
import {ConvertOperationProps} from 'components/operations/Convert';
import {
  SavingOperationProps,
  SavingsOperations,
} from 'components/operations/Savings';
import {TransferOperationProps} from 'components/operations/Transfer';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export const getHBDButtonList = (user: ActiveAccount, theme: Theme) => {
  const styles = getButtonStyle(
    theme,
    useWindowDimensions().height,
  ).getOperationButtonStylesheet();
  return [
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-transfer-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'transfer',
          props: {
            currency: 'HBD',
            tokenBalance: user.account.hbd_balance as string,
            engine: false,
            tokenLogo: <></>,
          } as TransferOperationProps,
        });
      }}
      icon={
        <Icon
          theme={theme}
          name={Icons.TRANSFER}
          additionalContainerStyle={styles.roundedIcon}
          {...styles.icon}
        />
      }
      primaryLabel={translate('common.send')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-savings-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'savings',
          props: {
            currency: 'HBD',
            operation: SavingsOperations.deposit,
          } as SavingOperationProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          darkThemeIcon={<CurrencySavingDark {...styles.biggerIcon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.roundedIcon}
        />
      }
      primaryLabel={'HIVE'}
      secondaryLabel={translate('common.savings')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-convert-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'convert',
          props: {
            currency: getCurrency('HBD'),
          } as ConvertOperationProps,
        });
      }}
      icon={
        <Icon
          theme={theme}
          name={Icons.CONVERT}
          additionalContainerStyle={styles.roundedIcon}
          {...styles.icon}
        />
      }
      primaryLabel={translate('wallet.operations.convert.button')}
    />,
  ];
};
