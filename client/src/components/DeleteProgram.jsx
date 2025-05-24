import React from "react"

class DeleteProgram extends React.Component {
	render() {
		const { programs, handleDeleteProgram } = this.props

		return (
			<div className="delete-programs-wrapper">
				{programs.map(p => (
					<div key={p.id} className="delete-program">
						<p className="pixel-font"><strong>{p.label}</strong> ({p.id})</p>
						<button
							className="pixel-font"
							onClick={() => {
								if (window.confirm(`Ви впевнені, що хочете видалити "${p.label}"?`)) {
									handleDeleteProgram(p.id)
								}
							}}
						>
							Delete
						</button>
					</div>
				))}
			</div>
		)
	}
}

export default DeleteProgram
