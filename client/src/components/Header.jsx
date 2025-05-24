import React from "react"

import MainMenu from "./MainMenu"

class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="container">
                    <MainMenu page={this.props.page} handleChangePage={this.props.handleChangePage} />
                </div>
            </header>
        )
    }
}

export default Header