import React from 'react';

import './app.scss';

import Chrono from '../../components/Chrono/Chrono'
import Tv from '../../components/Tv/Tv'
import Playlist from '../../components/Playlist/Playlist'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: ''
    }
    this.onPlaylistSubmit = this.onPlaylistSubmit.bind(this);
  }
  onPlaylistSubmit({playlist}, e) {
    this.setState({ playlist })
  }
  render() {
    return <main role="main" className="App">
        <header className="d-flex">
          <Chrono />
          <Playlist submitHandler={this.onPlaylistSubmit}/>
        </header>
        <Tv playlist={this.state.playlist}/>
    </main>
  }
}

export default App;
