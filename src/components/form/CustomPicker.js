import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  ActionSheetIOS,
  Text,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const CustomPicker = ({
  list,
  selectedValue,
  onSelected,
  prefix,
  prompt,
  style,
}) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});
  switch (Platform.OS) {
    case 'ios':
      return (
        <TouchableOpacity
          style={[styles.iosContainer, style]}
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: list,
              },
              (index) => {
                onSelected(list[index]);
              },
            );
          }}>
          <Text style={styles.iosLabel}>{`${
            prefix ? prefix : ''
          }${selectedValue}`}</Text>
          <Text>{'\u25BC'}</Text>
        </TouchableOpacity>
      );
    case 'android':
      console.log('picker', selectedValue, list);

      return (
        <Picker
          style={{...styles.picker, ...style}}
          selectedValue={selectedValue}
          prompt={prompt}
          dropdownIconColor="black"
          onValueChange={onSelected}>
          {list.map((item, i) => {
            return (
              <Picker.Item
                key={i}
                label={`${prefix ? prefix : ''}${item}`}
                value={item}
              />
            );
          })}
        </Picker>
      );
    default:
      break;
  }
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    iosContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 20,
    },
    iosLabel: {fontSize: 18},
    picker: {color: 'black', marginLeft: -7},
  });

export default CustomPicker;
