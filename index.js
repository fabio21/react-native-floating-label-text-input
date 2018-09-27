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

var FIELD_HEIGHT = 50;
var ICON_SIZE = 25;
var PADDING_LEFT = 30;

class FloatingLabel extends Component {
  constructor(props) {
    super(props);

    let initialPadding = 9;
    let initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 5;
      initialOpacity = 1;
    }

    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  }

  componentWillReceiveProps(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 5 : 9,
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
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0)
    };
  }

  componentWillReceiveProps(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? 10 : 0,
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

class FloatLabelTextFieldIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: this.props.value,
      password: this.props.secureTextEntry,
      icEye: require("./recourses/lock.png")
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

  leftPadding() {
    return { width: this.props.leftPadding || 0 };
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
                onChangeText={value => this.setText(value)}
                secureTextEntry={this.state.password}
              />
            </TextFieldHolder>
            <Image style={[styles.iconContainer]} source={this.placeholderIconValue()} />

						<TouchableOpacity style={[styles.touch]} onPress={this.changePwdType}>
							<Image style={[styles.iconContainerButton]}source={this.placeholderIconValueButton()} />
						</TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  changePwdType = () => {
		let newState;
		if (this.state.password) {
			newState = {
				icEye: require('./recourses/lock-open.png'),
				password: false
			}
		} else {
			newState = {
				icEye: require('./recourses/lock.png'),
				password: true
			}
		}

		// set new state value
		this.setState(newState)
	}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 45,
    backgroundColor: "white",
    justifyContent: "center"
  },
  viewContainer: {
    flex: 1,
    flexDirection: "row"
  },
  paddingView: {
    width: 15
  },
  floatingLabel: {
    position: "absolute",
    top: 0,
    left: 0
  },
  fieldLabel: {
    height: 15,
    fontSize: 10,
    color: "#B1B1B1"
  },
  fieldContainer: {
    flex: 1,
    justifyContent: "center",
    position: "relative"
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: "#C8C7CC"
  },
  valueText: {
    height: Platform.OS == "ios" ? 20 : 60,
    fontSize: 16,
    color: "#111111"
  },
  focused: {
    color: "#1482fe"
  },
  paddingLeft: {
    paddingLeft: PADDING_LEFT
  },

  paddingRight: {
    paddingRight: PADDING_LEFT
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    left: 0,
    resizeMode: "contain",
    top: (FIELD_HEIGHT - ICON_SIZE) / 2,
    position: "absolute"
  },
  iconContainerButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    right: 0,
    resizeMode: "contain",
    top: (FIELD_HEIGHT - ICON_SIZE) / 2,
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

export default FloatLabelTextFieldIcon;
