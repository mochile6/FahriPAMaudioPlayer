import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import OptionModal from "../components/OptionModal";
import Screen from "../components/Screen";
import { Audio } from "expo-av";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      playBackObj: null,
      soundObj: null,
      currentAudio: {},
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    // set pertama putar audio
    if (this.state.soundObj === null) {
      const playBackObject = new Audio.Sound();
      const status = await playBackObject.loadAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );
      return this.setState({
        ...this.state,
        currentAudio: audio,
        playBackObj: playBackObject,
        soundObj: status,
      });
    }

    // set pause audio
    if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying) {
      const status = await this.state.playBackObj.setStatusAsync({
        shouldPlay: false,
      });
      return this.setState({
        ...this.state,
        soundObj: status,
      });
    }
    // set resume audio
    if (
      this.state.soundObj.isLoaded &&
      !this.state.soundObj.isPlaying &&
      this.state.currentAudio.id === audio.id
    ) {
      const status = await this.state.playBackObj.playAsync();
      return this.setState({
        ...this.state,
        soundObj: status,
      });
    }

    // putar audio lain
    if (this.state.currentAudio.id !== audio.id) {
      const playBackObject = new Audio.Sound();
      const status = await playBackObject.loadAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );
      return this.setState({
        ...this.state,
        currentAudio: audio,
        playBackObj: playBackObject,
        soundObj: status,
      });
    }
  };

  rowRenderer = (type, item) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        onAudio={() => this.handleAudioPress(item)}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              />
              <OptionModal
                onPlay={() => console.log("play")}
                onPlayList={() => console.log("add playlist")}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({
                    ...this.state,
                    optionModalVisible: false,
                  })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AudioList;
