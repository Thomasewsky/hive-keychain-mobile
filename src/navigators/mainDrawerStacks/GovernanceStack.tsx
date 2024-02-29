import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Governance from 'screens/hive/governance/Governance';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {CARD_SMALLEST_PADDING} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator();

export default () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions(), useSafeAreaInsets());

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GovernanceScreen"
        component={Governance}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: translate('navigation.governance'),
          cardStyle: styles.cardStyle,
          headerRight: () => (
            <Icon
              name={Icons.CLOSE_CIRCLE}
              theme={theme}
              onClick={() => navigation.navigate('WALLET')}
              color={getColors(theme).iconBW}
            />
          ),
          headerLeft: () => (
            <Icon
              name={Icons.ARROW_LEFT}
              theme={theme}
              onClick={() =>
                (navigation as DrawerNavigationHelpers).openDrawer()
              }
              color={getColors(theme).iconBW}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: Dimensions,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    cardStyle: {
      paddingHorizontal: CARD_SMALLEST_PADDING,
      backgroundColor: getColors(theme).primaryBackground,
    },
  });
