import React from "react"

class MainMenu extends React.Component {
    render() {
        return (
            <div className="main-menu">
                <nav>
                    <ul className="pixel-font">
                        <li className={this.props.page === 'programs' ? 'active' : null} onClick={() => this.props.handleChangePage('programs')}>Programs</li>
                        <li className={this.props.page === 'add' ? 'active' : null} onClick={() => this.props.handleChangePage('add')}>Add</li>
                        <li className={this.props.page === 'edit' ? 'active' : null} onClick={() => this.props.handleChangePage('edit')}>Edit</li>
                        <li className={this.props.page === 'delete' ? 'active' : null} onClick={() => this.props.handleChangePage('delete')}>Delete</li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default MainMenu