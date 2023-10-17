import {Token, TokenBalance, TokenMarket} from 'actions/interfaces';
import HiveEngine from 'assets/wallet/hive_engine.png';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import {TransferOperationProps} from 'components/operations/Transfer';
import React, {useContext, useState} from 'react';
import {Image as Img, StyleSheet, useWindowDimensions} from 'react-native';
import Image from 'react-native-fast-image';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {Width} from 'utils/common.types';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {navigate} from 'utils/navigation';
import Icon from './Icon';
import TokenDisplay from './TokenDisplay';

type Props = {
  token: TokenBalance;
  tokensList: Token[];
  market: TokenMarket[];
  toggled: boolean;
  setToggle: () => void;
  //TODO bellow change to fix after refactoring
  using_new_ui?: boolean;
};
const EngineTokenDisplay = ({
  token,
  tokensList,
  market,
  toggled,
  setToggle,
  using_new_ui,
}: Props) => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  const [hasError, setHasError] = useState(false);
  const tokenInfo = tokensList.find((t) => t.symbol === token.symbol);
  const tokenMarket = market.find((t) => t.symbol === token.symbol);

  if (!tokenInfo) {
    return null;
  }
  const metadata = JSON.parse(tokenInfo.metadata);

  const logo = hasError ? (
    <Image
      style={styles.icon}
      source={{
        uri: Img.resolveAssetSource(HiveEngine).uri,
      }}
      onError={() => {
        console.log('default');
      }}
    />
  ) : (
    <Image
      style={styles.icon}
      source={{
        uri: metadata.icon,
      }}
      onError={() => {
        setHasError(true);
      }}
    />
  );
  return (
    <TokenDisplay
      name={tokenInfo.name}
      currency={token.symbol}
      color="black"
      amountStyle={styles.amount}
      value={parseFloat(token.balance)}
      //TODO review this value & fix later on
      //Quentin notes: Oh might be due to missing tokens. We used to get the first 1000 tokens, there are more now. Check on the extension dev branch, I fixed this issue recently, you can fix that on mobile dev and I'll push asap
      totalValue={getHiveEngineTokenValue(token, market)}
      toggled={toggled}
      setToggle={setToggle}
      price={{
        usd: tokenMarket ? parseFloat(tokenMarket.lastPrice) : 0,
        usd_24h_change: parseFloat(
          tokenMarket ? tokenMarket.priceChangePercent : '0',
        ),
      }}
      buttons={[
        <Icon
          key={`show-token-history-${token.symbol}`}
          name={'back_time'}
          onClick={() =>
            navigate('TokensHistory', {
              currency: token.symbol,
              tokenBalance: token.balance,
              tokenLogo: logo,
              theme: theme,
            } as TokenHistoryProps)
          }
          additionalContainerStyle={styles.squareButton}
          theme={theme}
        />,
        <Icon
          key={`show-token-transfer-${token.symbol}`}
          name={'transfer'}
          onClick={() => {
            navigate('Operation', {
              operation: 'transfer',
              props: {
                currency: token.symbol,
                tokenBalance: token.balance,
                engine: true,
                tokenLogo: logo,
              } as TransferOperationProps,
            });
          }}
          additionalContainerStyle={[styles.squareButton, styles.smallPadding]}
          theme={theme}
        />,
      ]}
      logo={logo}
      using_new_ui={using_new_ui}
      renderButtonOptions={true}
      theme={theme}
      tokenInfo={tokenInfo}
      tokenBalance={token}
    />
  );
};
const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  //TODO bellow removed unused styles
  StyleSheet.create({
    icon: {width: width / 12, height: width / 12},
    amount: {fontWeight: 'bold', fontSize: 15},
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      marginLeft: 7,
      padding: 8,
    },
    smallPadding: {
      padding: 3,
    },
    modalContainer: {
      flex: 1,
      // paddingTop: 20,
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      borderRadius: 0,
    },
  });

export default EngineTokenDisplay;
