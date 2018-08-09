/* @flow */
import * as React from "react";
import { ScrollView } from "react-native";

type Props = {
  horizontal: boolean,
  whetherIsFocused: boolean,
  children: any,
  threshold: number
};

export default class FocusedList extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.getScrollViewSize = this.getScrollViewSize.bind(this);
    this.getCenter = this.getCenter.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
    this.whetherIsFocused = this.whetherIsFocused.bind(this);

    this.state = {
      scrollViewX: 0,
      scrollViewY: 0,
      scrollViewHeight: 0,
      scrollViewWidth: 0,
      neverScroll: true
    };
  }

  getCenter() {
    if (this.props.horizontal) {
      const x = this.state.offsetX - this.state.scrollViewX;
      return x + this.state.scrollViewWidth / 2;
    }
    const y = this.state.offsetY - this.state.scrollViewY;
    return y + this.state.scrollViewHeight / 2;
  }

  getScrollViewSize(event) {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.setState({
      scrollViewX: x,
      scrollViewY: y,
      scrollViewWidth: width,
      scrollViewHeight: height
    });
  }

  getDisplaySize(index) {
    return event => {
      const { x, y, width, height } = event.nativeEvent.layout;
      let payload = {};
      payload["item" + index] = { index, x, y, width, height };
      this.setState(payload);
      return index, x, y, width, height;
    };
  }

  handleScroll(event) {
    this.setState({
      offsetY: event.nativeEvent.contentOffset.y,
      offsetX: event.nativeEvent.contentOffset.x,
      neverScroll: false
    });
  }

  handleScrollEnd(event) {
    if (!this.props.horizontal) {
      if (this.isCloseToBottom(event.nativeEvent)) {
        this.props.onEndReached();
      }
    } else {
      if (this.isCloseToRight(event.nativeEvent)) {
        this.props.onEndReached();
      }
    }
  }

  isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToRight = this.props.onEndReachedThreshold;
    return (
      layoutMeasurement.width + contentOffset.x >=
      contentSize.width - paddingToRight
    );
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = this.props.onEndReachedThreshold;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  whetherIsFocused(size, margin) {
    let distance;
    if (this.props.horizontal) {
      distance = Math.abs(size.x + size.width / 2 - this.getCenter());
    } else {
      distance = Math.abs(size.y + size.height / 2 - this.getCenter());
    }
    return distance < margin;
  }

  render() {
    const threshold = this.props.threshold ? this.props.threshold : 100;
    const whetherIsFocused = this.props.whetherIsFocused
      ? this.props.whetherIsFocused
      : this.whetherIsFocused;

    const children = this.props.children.map((item, i) => {
      const size = this.state["item" + i];
      let isFocused = false;
      if (typeof size === "undefined" || this.state.neverScroll) {
        if (i === 0) {
          isFocused = true;
        }
      } else {
        isFocused = whetherIsFocused(size, threshold);
      }
      return React.cloneElement(item, {
        onLayout: this.getDisplaySize(i),
        isFocused: isFocused
      });
    });

    return (
      <ScrollView
        {...this.props}
        onScroll={this.handleScroll}
        onScrollEndDrag={this.handleScrollEnd}
        scrollEventThrottle={100}
        onLayout={this.getScrollViewSize}
      >
        {children}
      </ScrollView>
    );
  }
}
