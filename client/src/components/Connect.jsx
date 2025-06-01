import React from "react"

class Connect extends React.Component {
    render() {
        const { selectedIp, handleSelectedIpChange, connectToServer, availableDevices } = this.props

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

                    {availableDevices.length > 0 && (
                        <ul>
                            {availableDevices.map(ip => (
                                <li key={ip}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectedIpChange({ target: { value: ip } })}
                                        className="pixel-font"
                                    >
                                        {ip}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button className="pixel-font" type="submit">Connect</button>
                </form>
            </div>
        )
    }
}

export default Connect
