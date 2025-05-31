import React from "react"

import ProgramsMenu from "./ProgramsMenu"
import LaunchButton from './LaunchButton'
import AddProgram from './AddProgram'
import EditProgram from './EditProgram'
import DeleteProgram from './DeleteProgram'

class ProgramsList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            programsPage: 'programs', // 'prograps', 'add', 'edit', 'delete'
        }

        this.handleProgramsChangePage = this.handleProgramsChangePage.bind(this)
    }

    handleProgramsChangePage(page) {
        this.setState({
            programsPage: page
        })
    }

    renderPage() {
        switch (this.state.programsPage) {
            case 'programs':
                return (
                    <div className="programs-wrapper">
                        {this.props.programs.map(({ id, label, image }) => (
                            <LaunchButton key={id} ip={this.props.ip} launchProgram={this.props.launchProgram} id={id} label={label} image={image} />
                        ))}
                    </div>
                )
            case 'add':
                return (
                    <AddProgram
                        handleProgramIdChange={this.props.handleProgramIdChange}
                        handleProgramLabelChange={this.props.handleProgramLabelChange}
                        handleAddProgram={this.props.handleAddProgram}
                        newProgramId={this.props.newProgramId}
                        newProgramLabel={this.props.newProgramLabel}
                        handleImageChange={this.props.handleImageChange}
                    />
                )
            case 'edit':
                return (
                    <EditProgram
                        programs={this.props.programs}
                        editIds={this.props.editIds}
                        editCommands={this.props.editCommands}
                        handleEditIdChange={this.props.handleEditIdChange}
                        handleEditCommandChange={this.props.handleEditCommandChange}
                        handleEditProgram={this.props.handleEditProgram}
                        handleEditImageChange={this.props.handleEditImageChange}
                    />
                )
            case 'delete':
                return (
                    <DeleteProgram
                        programs={this.props.programs}
                        handleDeleteProgram={this.props.handleDeleteProgram}
                    />
                )
            default:
                return <div>Programs</div>
        }
    }

    render() {
        return (
            <div className='programs-list'>
                <ProgramsMenu programsPage={this.state.programsPage} handleProgramsChangePage={this.handleProgramsChangePage} />

                {this.renderPage()}
            </div>
        )
    }
}

export default ProgramsList