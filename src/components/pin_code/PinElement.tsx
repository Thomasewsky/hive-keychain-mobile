import BackspaceDark from 'assets/new_UI/backspace_dark_theme.svg';
import BackspaceLight from 'assets/new_UI/backspace_light_theme.svg';
import React from 'react';
import {
  Dimensions,
  ScaledSize,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  headerH2Primary,
  title_primary_body_2,
} from 'src/styles/typography';

interface Props {
  number?: number;
  refNumber: number;
  helper?: string;
  back?: boolean;
  onPressElement: (number: number | undefined, back?: boolean) => void;
}

export default ({number, refNumber, helper, back, onPressElement}: Props) => {
  const {theme} = useThemeContext();
  const [activeShape, setActiveshape] = React.useState(null);
  const [pressed, setPressed] = React.useState(false);
  const dimensionReducer = 0.2;
  const {width, height}: ScaledSize = Dimensions.get('window');
  const styles = getStyles(
    theme,
    Dimensions.get('window'),
    dimensionReducer,
    pressed,
  );
  const fontResizedSize = (currentFontSize: number): TextStyle => {
    return {fontSize: getFontSizeSmallDevices(height, currentFontSize)};
  };

  const renderPinElements = () => {
    return (
      <View style={styles.pinElements}>
        {number || number === 0 ? (
          <Text
            style={{
              ...styles.number,
              ...fontResizedSize(styles.number.fontSize),
            }}>
            {number}
          </Text>
        ) : null}
        {helper ? (
          <Text
            style={{
              ...styles.helper,
              ...fontResizedSize(styles.helper.fontSize),
            }}>
            {helper}
          </Text>
        ) : null}
        {back ? (
          theme === Theme.DARK ? (
            <BackspaceDark style={styles.backspace} />
          ) : (
            <BackspaceLight style={styles.backspace} />
          )
        ) : null}
      </View>
    );
  };

  const renderWithGradients = (refNumber: number) => {
    return refNumber !== 10 && refNumber !== 12 ? (
      <LinearGradient
        style={styles.pinElements}
        start={{x: 1, y: 0.5}} //initially as {x: 1, y: 0.5}
        end={{x: 1, y: 1.8}} //initially as {x: 1, y: 1.8}
        colors={getColors(theme).gradientShapes}>
        {renderPinElements()}
      </LinearGradient>
    ) : (
      renderPinElements()
    );
  };

  return (
    <TouchableOpacity
      disabled={refNumber === 10}
      onPressIn={() => {
        if (refNumber !== 10 && refNumber !== 12) {
          setActiveshape(<View style={styles.pinElementPressed} />);
          setPressed(true);
        }
      }}
      onPressOut={() => {
        setActiveshape(null);
        setPressed(false);
      }}
      onPress={() => onPressElement(number, back)}
      style={styles.pinElements}
      activeOpacity={1}>
      {activeShape}
      {renderWithGradients(refNumber)}
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: ScaledSize,
  dimensionReducer: number,
  pressed: boolean,
) =>
  StyleSheet.create({
    pinElements: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      margin: 8,
      width: width * dimensionReducer,
      height: Math.round(width * dimensionReducer),
      borderRadius: width * dimensionReducer,
    },
    pinElementPressed: {
      position: 'absolute',
      width: width * dimensionReducer,
      height: Math.round(width * dimensionReducer),
      borderRadius: width * dimensionReducer,
      backgroundColor: getColors(theme).primaryRedShape,
      zIndex: -1,
    },
    number: {
      flex: 0.65,
      color: !pressed ? getColors(theme).secondaryText : '#FFF',
      ...headerH2Primary,
      includeFontPadding: false,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    helper: {
      color: !pressed ? getColors(theme).secondaryText : '#FFF',
      ...title_primary_body_2,
    },
    backspace: {
      top: undefined,
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 40,
      height: 40,
    },
  });
