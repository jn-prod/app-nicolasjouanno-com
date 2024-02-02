import React from 'react'
import './playlist.scss'

class Playlist extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playlist: ''
        }
        this.updatePlaylist = this.updatePlaylist.bind(this)
        this.onFormChange = this.onFormChange.bind(this)
    }

    updatePlaylist(e) {
        this.setState({playlist: e.target.value});
    }

    onFormChange(e) {
        e.preventDefault();
        this.props.submitHandler({playlist: this.state.playlist}, e);
    }

    render() {
        return <form onSubmit={this.onFormChange} className="Playlist">
            <label htmlFor="playlist-input" aria-label="Enter your playlist" />
            <input id="playlist-input" name="playlist-input" type="url" className="form-control" value={this.state.playlist} onChange={this.updatePlaylist}/>
            <button type='submit' className="btn">Lire</button>
        </form>
    }
}

export default Playlist;