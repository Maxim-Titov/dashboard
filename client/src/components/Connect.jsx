import React from "react"

class Connect extends React.Component {
    render() {
        const { selectedIp, handleSelectedIpChange, connectToServer } = this.props

        return (
            <div className="connect-wrapper">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    connectToServer(selectedIp)
                }}>
                    <input
                        type="text"
                        placeholder="Computer IP"
                        value={selectedIp}
                        onChange={handleSelectedIpChange}
                        className="pixel-font"
                    /> <br />

                    <button className="pixel-font" type="submit">Connect</button> <br />
                </form>
            </div>
        )
    }
}

export default Connect
