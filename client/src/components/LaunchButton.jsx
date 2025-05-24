import React from "react"

class LaunchButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isClicked: false
        }

        this.buttonRef = React.createRef()

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({ isClicked: true })

        this.props.launchProgram(this.props.id)

        const el = this.buttonRef.current

        el.removeEventListener('animationend', this.handleAnimationEnd)

        el.addEventListener('animationend', this.handleAnimationEnd)
    }

    handleAnimationEnd = () => {
        this.setState({ isClicked: false })
        const el = this.buttonRef.current
        el.removeEventListener('animationend', this.handleAnimationEnd)
    }

    render() {
        const { image, ip, label } = this.props
        const { isClicked } = this.state

        return (
            <div
                ref={this.buttonRef}
                className={`program-button ${isClicked ? 'clicked' : ''}`}
                onClick={this.handleClick}
            >
                {image
                    ? <img src={`http://${ip}:3001/images/${image}`} alt={label} />
                    : <p className="pixel-font">{label}</p>}
            </div>
        )
    }
}

export default LaunchButton
