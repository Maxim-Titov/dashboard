import React from "react"

class EditProgram extends React.Component {
	render() {
		const {
			programs,
			editIds,
			editCommands,
			handleEditIdChange,
			handleEditCommandChange,
			handleEditProgram
		} = this.props

		return (
			<div className="edit-program-wrapper">
				{programs.map(p => (
					<div key={p.id}>
						<p className="pixel-font"><strong>{p.label}</strong> ({p.id})</p>

						<input
							type="file"
							accept="image/*"
							onChange={e => this.props.handleEditImageChange(p.id, e.target.files[0])}
							className="image-input pixel-font"
						/> <br />

						<input
							placeholder="New label"
							value={editIds[p.id] || ''}
							onChange={e => handleEditIdChange(p.id, e.target.value)}
							style={{ marginRight: '1%' }}
							className="pixel-font"
						/>

						<input
							placeholder="New id"
							value={editCommands[p.id] || ''}
							onChange={e => handleEditCommandChange(p.id, e.target.value)}
							style={{ marginLeft: '1%' }}
							className="pixel-font"
						/> <br />

						<button className="pixel-font" onClick={() => handleEditProgram(p.id)}>Save</button>
					</div>
				))}
			</div>
		)
	}
}

export default EditProgram
