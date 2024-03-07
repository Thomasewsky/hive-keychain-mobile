import Icon from 'components/hive/Icon';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {InputProps} from 'react-native-elements';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {AutoCompleteValuesType} from 'src/interfaces/autocomplete.interface';
import {getColors} from 'src/styles/colors';
import {LABEL_INDENT_SPACE} from 'src/styles/spacing';
import {
  FontPoppinsName,
  body_primary_body_1,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import CustomInput from './CustomInput';

interface OperationInputProps {
  infoIconAction?: () => void;
  labelInput?: string;
  labelExtraInfo?: string;
  labelBottomExtraInfo?: string;
  additionalOuterContainerStyle?: StyleProp<ViewStyle>;
  additionalLabelStyle?: StyleProp<TextStyle>;
  additionalInputContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelTextStyle?: StyleProp<TextStyle>;
  additionalLabelExtraInfoTextStyle?: StyleProp<TextStyle>;
  removeLabelInputIndent?: boolean;
  autoCompleteValues?: AutoCompleteValuesType;
  additionalinfoIconActionColor?: string;
}

export default (props: InputProps & OperationInputProps) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);

  const renderCustomInput = () => (
    <CustomInput
      {...props}
      containerStyle={styles.container}
      additionalInputContainerStyle={props.additionalInputContainerStyle}
      autoCompleteValues={props.autoCompleteValues}
    />
  );

  return props.labelInput ? (
    <View style={[styles.outerContainer, props.additionalOuterContainerStyle]}>
      <View style={styles.labelInputContainer}>
        <Text
          style={[
            styles.labelStyle,
            props.additionalLabelStyle,
            props.removeLabelInputIndent ? undefined : styles.labelIndent,
          ]}>
          {props.labelInput}
        </Text>
        {props.infoIconAction && (
          <Icon
            theme={theme}
            name={Icons.INFO}
            onClick={props.infoIconAction}
            additionalContainerStyle={styles.marginLeft}
            color={props.additionalinfoIconActionColor}
          />
        )}
        {props.labelExtraInfo && (
          <Text
            style={[
              styles.smallerLabelSize,
              props.additionalLabelExtraInfoTextStyle,
            ]}>
            {props.labelExtraInfo}
          </Text>
        )}
      </View>
      {renderCustomInput()}
      {props.labelBottomExtraInfo && (
        <View style={props.additionalBottomLabelContainerStyle}>
          <Text style={props.additionalBottomLabelTextStyle}>
            {props.labelBottomExtraInfo}
          </Text>
        </View>
      )}
    </View>
  ) : (
    renderCustomInput()
  );
};

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      display: 'flex',
      marginLeft: 0,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    outerContainer: {
      display: 'flex',
      width: '100%',
    },
    labelStyle: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_1}.fontSize,
      ),
    },
    labelInputContainer: {
      marginBottom: 2,
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    smallerLabelSize: {
      marginLeft: 10,
      fontFamily: FontPoppinsName.ITALIC,
      fontSize: getFontSizeSmallDevices(width, 13),
      color: getColors(theme).primaryText,
    },
    marginLeft: {
      marginLeft: 8,
    },
    labelIndent: {
      marginLeft: LABEL_INDENT_SPACE,
    },
  });
