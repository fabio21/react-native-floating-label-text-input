import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  Image,
  Platform,
  TouchableOpacity
} from "react-native";

var FIELD_HEIGHT = Platform.OS === "ios" ? 45 : 47;
var ICON_SIZE = 25;
var PADDING_LEFT = Platform.OS === "ios" ? 30 : 25;

class FloatingLabel extends Component {
  constructor(props) {
    super(props);

    let initialPadding = 3;
    let initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 1;
      initialOpacity = 1;
    }

    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  }

  componentWillReceiveProps(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 1 : 3,
      duration: 230
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: 230
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.floatingLabel,
          {
            paddingTop: this.state.paddingAnim,
            opacity: this.state.opacityAnim
          }
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

class TextFieldHolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginAnim: new Animated.Value(this.props.withValue ? 13 : 0)
    };
  }

  componentWillReceiveProps(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? 13 : 0,
      duration: 230
    }).start();
  }

  render() {
    return (
      <Animated.View style={{ marginTop: this.state.marginAnim }}>
        {this.props.children}
      </Animated.View>
    );
  }
}
var size = 0;
var ms = "";
class FloatLabelTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: this.props.value,
      password: this.props.secureTextEntry,
      disabled: this.props.disabled,
      icEye: require("../../assets/icon/lock.png")
    };
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.hasOwnProperty("value") &&
      newProps.value !== this.state.text
    ) {
      this.setState({ text: newProps.value });
    }
  }

  withBorder() {
    if (!this.props.noBorder) {
      return styles.withBorder;
    }
  }

  withIcon() {
    return this.props.placeholderIcon ? styles.paddingLeft : 0;
  }

  withIconButton() {
    return this.props.placeholderButton ? styles.paddingRight : 0;
  }

  render() {
    const { disabled } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.paddingView} />
          <View
            style={[
              styles.fieldContainer,
              this.withBorder(),
              this.withIcon(),
              this.withIconButton()
            ]}
          >
            {this.props.placeholder && (
              <FloatingLabel visible={this.state.text}>
                <Text
                  style={[
                    styles.fieldLabel,
                    this.labelStyle(),
                    this.withIcon(),
                    this.withIconButton()
                  ]}
                >
                  {this.placeholderValue()}
                </Text>
              </FloatingLabel>
            )}
            <TextFieldHolder withValue={this.state.text}>
              <TextInput
                {...this.props}
                ref="input"
                style={[styles.valueText, { color: "black" }]}
                defaultValue={this.props.defaultValue}
                value={this.state.text}
                maxLength={this.props.maxLength}
                underlineColorAndroid="transparent"
                onFocus={() => this.setFocus()}
                onBlur={() => this.unsetFocus()}
                onChangeText={(value) => this.setText(value)}
                secureTextEntry={this.state.password}
              />
            </TextFieldHolder>
            <Image
              style={[styles.iconContainer]}
              source={this.placeholderIconValue()}
            />
            {disabled ? null : (
              <TouchableOpacity
                style={[styles.touch]}
                onPress={this.changePwdType}
              >
                <Image
                  style={[styles.iconContainerButton]}
                  source={this.placeholderIconValueButton()}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  changePwdType = () => {
    let newState;
    if (this.state.password) {
      newState = {
        icEye: require("../../assets/icon/lock-open.png"),
        password: false
      };
    } else {
      newState = {
        icEye: require("../../assets/icon/lock.png"),
        password: true
      };
    }

    // set new state value
    this.setState(newState);
  };

  inputRef() {
    return this.refs.input;
  }

  focus() {
    this.inputRef().focus();
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }

  setFocus() {
    this.setState({
      focused: true
    });
    try {
      return this.props.onFocus();
    } catch (_error) {}
  }

  unsetFocus() {
    this.setState({
      focused: false
    });
    try {
      return this.props.onBlur();
    } catch (_error) {}
  }

  labelStyle() {
    if (this.state.focused) {
      return styles.focused;
    }
  }

  placeholderValue() {
    if (this.state.text) {
      return this.props.placeholder;
    }
  }

  placeholderIconValue() {
    if (this.props.placeholderIcon) {
      return this.props.placeholderIcon;
    }
  }

  placeholderIconValueButton() {
    if (this.props.placeholderButton) {
      return this.state.icEye;
    }
  }

  setText(value) {
   
    this.setState({
      text: value
    });
    try {
      return this.props.onChangeTextValue(value);
    } catch (_error) {}
  }
}

//StyleSheet.css
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    height: FIELD_HEIGHT,
    margin: Platform.OS === "ios" ? 2 : 3
  },
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    alignContent: "flex-end",
    paddingTop: Platform.OS === "ios" ? 2 : 3,
    paddingBottom: Platform.OS === "ios" ? 2 : 3
  },
  paddingView: {
    width: 0,
    padding: 0
  },
  floatingLabel: {
    position: "absolute",
    top: 0,
    left: 0
  },
  fieldLabel: {
    height: Platform.OS === "ios" ? 10 : 11,
    fontSize: Platform.OS === "ios" ? 9 : 8,
    backgroundColor: "transparent",
    color: "gray"
  },
  paddingLeft: {
    paddingLeft: PADDING_LEFT
  },

  paddingRight: {
    paddingRight: PADDING_LEFT
  },

  fieldContainer: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    backgroundColor: "transparent"
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: "#C8C7CC"
  },
  valueText: {
    height: Platform.OS === "ios" ? 25 : 26,
    fontSize: Platform.OS === "ios" ? 16 : 14,
    color: "#111111"
  },
  focused: {
    color: "#111111"
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    left: 0,
    resizeMode: "contain",
    position: "absolute"
  },
  iconContainerButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    right: 0,
    resizeMode: "contain",
    top: (FIELD_HEIGHT - ICON_SIZE) / 3,
    position: "absolute",
    backgroundColor: "transparent"
  },
  touch: {
    width: Platform.OS == "ios" ? (ICON_SIZE * 4) / 2.5 : (ICON_SIZE * 3) / 2,
    height: Platform.OS == "ios" ? (ICON_SIZE * 4) / 2.5 : (ICON_SIZE * 3) / 2,
    right: 0,
    position: "absolute",
    alignItems: "center",
    alignContent: "center"
  }
});

export default FloatLabelTextField;
