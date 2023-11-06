import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  fields_primary_text_2,
  title_secondary_body_3,
  title_secondary_title_2,
} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import Icon from './Icon';

type Props = {
  IconBgcolor: string;
  percent: number;
  name: string;
  theme: Theme;
  iconName: string;
  bgColor: string;
  secondary?: string;
};
const PercentageDisplay = ({
  IconBgcolor,
  percent,
  name,
  secondary,
  theme,
  iconName,
  bgColor,
}: Props) => {
  const styles = getDimensionedStyles({
    IconBgcolor,
    percent,
    theme,
    bgColor,
    ...useWindowDimensions(),
  });

  return (
    <View style={styles.container}>
      <Icon
        theme={theme}
        name={iconName}
        additionalContainerStyle={styles.iconContainer}
      />
      <View style={styles.textWrapper}>
        <View style={{flexGrow: 1}}>
          <Text style={styles.name}>{name}</Text>
          <View style={[styles.textWrapper, styles.justifyBetween]}>
            <Text style={styles.percent}>
              {`${percent.toFixed(0)}`}
              <Text style={[{...title_secondary_body_3}]}> %</Text>
            </Text>
            <Text style={styles.secondary}>{secondary}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getDimensionedStyles = ({
  width,
  IconBgcolor,
  percent,
  theme,
  bgColor,
}: Width & {
  IconBgcolor: string;
  percent: number;
  theme: Theme;
  bgColor: string;
}) =>
  //TODO cleanup styles
  StyleSheet.create({
    textWrapper: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
    },
    justifyBetween: {
      justifyContent: 'space-between',
      flexGrow: 1,
      maxWidth: '90%',
    },
    name: {
      color: '#FFF',
      opacity: 0.7,
      ...title_secondary_body_3,
    },
    percent: {color: '#FFF', ...title_secondary_title_2, lineHeight: 30},
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '48%',
      borderColor: getColors(theme).cardBorderColorJustDark,
      borderWidth: theme === Theme.DARK ? 1 : 0,
      borderRadius: 13,
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: bgColor,
    },
    greyBar: {
      height: 2,
      width: 0.42 * width,
      backgroundColor: '#D7E9F8',
    },
    iconContainer: {
      backgroundColor: IconBgcolor,
      borderRadius: 12,
      padding: 6.49,
      width: 33,
      height: 33,
      marginRight: 5,
    },
    secondary: {
      color: '#FFF',
      ...fields_primary_text_2,
      textAlignVertical: 'bottom',
    },
  });

export default PercentageDisplay;
