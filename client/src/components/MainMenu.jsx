import React from "react"
import { isMobile } from "react-device-detect"

class MainMenu extends React.Component {
    render() {
        return (
            <div className="main-menu">
                <nav>
                    <ul className="pixel-font">
                        <li className={this.props.page === 'programs' ? 'active' : null} onClick={() => this.props.handleChangePage('programs')}>Programs</li>
                        {isMobile
                            ? <li className='blocked'>Voice</li>
                            : <li className={this.props.page === 'voice' ? 'active' : null} onClick={() => this.props.handleChangePage('voice')}>Voice</li>
                        }
                    </ul>
                </nav>
            </div>
        )
    }
}

export default MainMenu