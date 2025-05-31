import React from "react"

class ProgramsMenu extends React.Component {
    render() {
        return (
            <div className="programs-menu">
                <nav>
                    <ul className="pixel-font">
                        <li className={this.props.programsPage === 'programs' ? 'active' : null} onClick={() => this.props.handleProgramsChangePage('programs')}>Programs</li>
                        <li className={this.props.programsPage === 'add' ? 'active' : null} onClick={() => this.props.handleProgramsChangePage('add')}>Add</li>
                        <li className={this.props.programsPage === 'edit' ? 'active' : null} onClick={() => this.props.handleProgramsChangePage('edit')}>Edit</li>
                        <li className={this.props.programsPage === 'delete' ? 'active' : null} onClick={() => this.props.handleProgramsChangePage('delete')}>Delete</li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default ProgramsMenu