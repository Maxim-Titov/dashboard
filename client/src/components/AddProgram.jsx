import React from "react"

class AddProgram extends React.Component {
    render() {
        return (
            <div className="add-program-wrapper">
				<input
					type="file"
					onChange={(e) => this.props.handleImageChange(e.target.files[0])}
					className="pixel-font"
				/>

                <input
					placeholder="ID"
					value={this.props.newProgramId}
					onChange={e => this.props.handleProgramIdChange(e.target.value)}
					className="pixel-font"
				/>
                
				<input
					placeholder="Label"
					value={this.props.newProgramLabel}
					onChange={e => this.props.handleProgramLabelChange(e.target.value)}
					className="pixel-font"
				/>

				<button className="pixel-font" type="button" onClick={this.props.handleAddProgram}>Add</button>
            </div>
        )
    }
}

export default AddProgram