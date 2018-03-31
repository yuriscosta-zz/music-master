import React, { Component } from 'react';
import './App.css';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      artist: null,
      tracks: [],
    }
  }

  search() {
    const BASE_URL = 'https://api.spotify.com/v1/search?';
    const ALBUM_URL = 'https://api.spotify.com/v1/artists/';
    let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
    const ACCESS_TOKEN = 'BQAWi3dNt8n-S-9ig2nUq4m4G7yNgZ3xI6makVwfi5ZNRQGFBVBMi0FZUOoABdkEsH3pt5FSznLGtlJKKK8OT4tXefwziTe-nSgvPD2k6eidPrJZccfaGKhtNCUsSzH-iWBVELe7pHolTGgiL8q5pBA_3eR4';

    let myOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      mode: 'cors',
      cache: 'default',
    };

    fetch(FETCH_URL, myOptions)
      .then(res => res.json())
      .then(json => {
        const artist = json.artists.items[0];
        this.setState({ artist });

        FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`;
        fetch(FETCH_URL, myOptions)
          .then(res => res.json())
          .then(json => {
            const { tracks } = json;
            this.setState({ tracks });
          });
      });
  }

  render() {
    return (
      <div className="app">
        <div className="app-title">Music Master</div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search for an artist"
              value={this.state.query}
              onChange={event => { this.setState({ query: event.target.value }) }}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search()
                }
              }}
            />
            <InputGroup.Addon onClick={() => this.search()}>
              <Glyphicon glyph="search"></Glyphicon>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {
          this.state.artist !== null
            ?
            <div>
              <Profile
                artist={this.state.artist}
              />
              <Gallery
                tracks={this.state.tracks}
              />
            </div>

            : <div></div>
        }
      </div>
    )
  }
}

export default App;