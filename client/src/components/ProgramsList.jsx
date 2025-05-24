import React from "react"

import LaunchButton from '../components/LaunchButton'

class ProgramsList extends React.Component {
    render() {
        return (
            <div className='programs-wrapper'>
                {this.props.programs.map(({ id, label, image }) => (
                    <LaunchButton key={id} ip={this.props.ip} launchProgram={this.props.launchProgram} id={id} label={label} image={image} />
                ))}
            </div>
        )
    }
}

export default ProgramsList