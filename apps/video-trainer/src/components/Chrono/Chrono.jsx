import React from 'react'
import ChronoService from '../../services/chrono.service'
import './chrono.scss'

class Chrono extends React.Component {
    constructor(props){
        super(props)
        this.state = { n: 0, timer: null};
        this.toggle = this.toggle.bind(this)
        this.reset = this.reset.bind(this)
        this.chronoService = new ChronoService()
    }

    componentWillUnmount() {
        this.pause()
    }

    updateChrono() {
        this.setState({n: this.state.n + 1})
    }

    reset(e) {
        this.setState({n: 0})
    }

    play(e) {
        if (this.state.timer !== null) return;

        window.clearInterval(this.state.timer)
        this.setState({timer: window.setInterval(this.updateChrono.bind(this), 1000)})
    }

    pause(e) {
        window.clearInterval(this.state.timer)
        this.setState({timer: null});
    }

    toggle() {
        return this.state.timer ? this.pause() : this.play();
    }

    label() {
        return this.state.timer ? 'pause' : 'play';
    }

    render() {
        return <article className="Chrono">
            <span>{this.chronoService.toHHMMSS(this.state.n)}</span>
            <button onClick={this.toggle} className="btn btn-light">{this.label()}</button>
            <button onClick={this.reset} className="btn btn-light">Reset</button>
        </article>
    }
}

export default Chrono