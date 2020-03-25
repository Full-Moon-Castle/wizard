import React, {Component} from 'react';
import Styles from '../style/style';
import api from '../services/api';
import {Actions} from 'react-native-router-flux';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
} from 'react-native';

const logoImage = require('../images/logo4.png');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      offset: new Animated.ValueXY({x: 0, y: 95}),
      opacity: new Animated.Value(0),
      success: '',
      error: '',
      logo: new Animated.ValueXY({x: 300, y: 120}),
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    Animated.parallel([
      Animated.spring(this.state.offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 30,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500,
      }),
    ]).start();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handleUsernameChange = username => {
    this.setState({error: ''});
    this.setState({username});
  };

  handlePasswordChange = password => {
    this.setState({error: ''});
    this.setState({password});
  };

  _keyboardDidShow = () => {
    Animated.parallel([
      Animated.timing(this.state.logo.x, {
        toValue: 150,
        duration: 200,
      }),
      Animated.timing(this.state.logo.y, {
        toValue: 65,
        duration: 200,
      }),
    ]).start();
  };

  _keyboardDidHide = () => {
    Animated.parallel([
      Animated.timing(this.state.logo.x, {
        toValue: 300,
        duration: 200,
      }),
      Animated.timing(this.state.logo.y, {
        toValue: 120,
        duration: 200,
      }),
    ]).start();
  };

  handleSignUpPress = async () => {
    Keyboard.dismiss();
    if (this.state.sername === 0 || this.state.password.length === 0) {
      this.setState(
        {error: 'Preencha todos os campos para continuar!'},
        () => false,
      );
    } else {
      try {
        const response = await api.post('', {
          username: this.state.username,
          password: this.state.password,
        });
      } catch (_err) {
        console.log(_err.toString());
        this.setState({
          error: _err.toString(),
        });
      }
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={Styles.backGround}>
        <View style={[Styles.containerLogo]}>
          <Animated.Image
            style={[
              {
                width: this.state.logo.x,
                height: this.state.logo.y,
                opacity: this.state.opacity,
                transform: [{translateY: this.state.offset.y}],
              },
            ]}
            source={logoImage}
          />
        </View>
        <Animated.View style={[Styles.containerForm]}>
          <TextInput
            style={Styles.inputLogin}
            placeholder="Login"
            autoCorrect={false}
            value={this.state.username}
            onChangeText={this.handleUsernameChange}
            onFocus={() => this.setState({error: ''})}
          />
          <TextInput
            style={Styles.inputLogin}
            placeholder="Senha"
            autoCorrect={false}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            secureTextEntry
            onFocus={() => this.setState({error: ''})}
          />
          <TouchableOpacity
            onPress={this.handleSignUpPress}
            style={Styles.btnSubmitLogin}>
            <Text style={Styles.textSubmitLogin}>Acessar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Actions.SignUp();
            }}
            style={Styles.btnRegisterLogin}>
            <Text style={Styles.textRegisterLogin}>Criar Conta</Text>
          </TouchableOpacity>
          {this.state.error.length !== 0 && (
            <Text style={Styles.ErrorMessageLogin}>{this.state.error}</Text>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }
}
