# react-native-focused-list
Focused scrollview with onReachEnd props for infinit scroll

## Installation

```console
$ yarn add react-native-focused-list
```

## Example
```jsx
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry, StyleSheet, Dimensions, Text, View } from "react-native";

import FocusedList from "react-native-focused-list";

class UserComponent extends Component {
  render() {
    let focusText;
    let opacity;
    if (this.props.isFocused) {
      focusText = <Text style={{ color: "#ff0" }}>Focused!</Text>;
      opacity = { opacity: 1 };
    } else {
      focusText = <Text style={{ color: "#fff" }}>Not Focused!</Text>;
      opacity = { opacity: 0.4 };
    }

    return (
      <View
        style={[styles.square, styles.wrapper]}
        onLayout={this.props.onLayout}
      >
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{this.props.name.first}</Text>
          {focusText}
        </View>
      </View>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=5`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(url, res.results);
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.data.length !== 0 && (
          <FocusedList
            threshold={100}
            horizontal
            onEndReachedThreshold={100}
            onEndReached={this.handleLoadMore}
            showsHorizontalScrollIndicator={false}
          >
            {this.state.data.map((user, index) => (
              <UserComponent key={index} {...user} />
            ))}
          </FocusedList>
        )}
      </View>
    );
  }
}

const dim = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    top: 20
  },
  square: {
    width: dim.width / 2,
    height: 120
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    marginHorizontal: 10
  },
  textWrapper: {
    position: "absolute",
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  text: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    alignContent: "center",
    alignSelf: "center"
  }
});
```
