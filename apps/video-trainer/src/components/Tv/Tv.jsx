import React from 'react'
import './tv.scss'

class Tv extends React.Component {
    constructor(props) {
        super(props)
        this.displayPlaylist = this.displayPlaylist.bind(this);
    }

    generateUrlFromYoutube(url = '') {
        // 'https://www.youtube.com/watch?v=oYuybfkwGx4&list=PLjwdMgw5TTLWom67YfZuha-1iYzIirwJR&index=6'
        const id = url.split('?')[1]?.split('&')[0]?.replace('v=', '')
        return `https://www.youtube.com/embed/${id}`
    }

    displayPlaylist(){
        return this.generateUrlFromYoutube(this.props.playlist)
    }

    render() {
        return <article className="Tv">
            <iframe title="youtube" width="100%" height="100%" src={this.displayPlaylist()} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </article>
    }
}

export default Tv