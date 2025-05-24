import React from "react"

class LaunchButton extends React.Component {
    render () {
        return (
            <div className="program-button"
                onClick={() => this.props.launchProgram(this.props.id)}
            >

                {this.props.image ? <img src={`http://${this.props.ip}:3001/images/${this.props.image}`} alt={this.props.label} /> : <p className="pixel-font">this.props.label</p>}
            </div>
        )
    }
}

export default LaunchButton