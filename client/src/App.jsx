import React from 'react'

import Connect from './components/Connect'
import Header from './components/Header'
import ProgramsList from './components/ProgramsList'
import AddProgram from './components/AddProgram'
import EditProgram from './components/EditProgram'
import DeleteProgram from './components/DeleteProgram'

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			page: 'programs', // 'prograps', 'add', 'edit', 'delete'
			isConnected: false,
			ip: '',
			selectedIp: '',
			status: '',
			programs: [],
			newProgramId: '',
			newProgramLabel: '',
  			newProgramImageFile: null,
			editIds: {},
			editCommands: {},
			editImages: {}
		}

		this.connectToServer = this.connectToServer.bind(this)
		this.handleChangePage = this.handleChangePage.bind(this)
		this.launchProgram = this.launchProgram.bind(this)
		this.handleAddProgram = this.handleAddProgram.bind(this)
		this.handleProgramIdChange = this.handleProgramIdChange.bind(this)
		this.handleProgramLabelChange = this.handleProgramLabelChange.bind(this)
		this.handleEditIdChange = this.handleEditIdChange.bind(this)
		this.handleEditCommandChange = this.handleEditCommandChange.bind(this)
		this.handleEditProgram = this.handleEditProgram.bind(this)
		this.handleDeleteProgram = this.handleDeleteProgram.bind(this)
		this.handleImageChange = this.handleImageChange.bind(this)
		this.handleEditImageChange = this.handleEditImageChange.bind(this)
		this.loadPrograms = this.loadPrograms.bind(this)
	}

	async connectToServer(ip) {
		try {
			// Завантаження списку програм
			const res = await fetch(`https://${ip}:3001/programs`)
			const programs = await res.json()

			this.setState({
				ip,
				isConnected: true,
				programs
			})

		} catch (e) {
			alert('Не вдалося підключитися або отримати список програм')
		}
	}

	async launchProgram(programId) {
		this.setState({ status: 'Відправляю команду...' })

		try {
			const res = await fetch(`http://${this.state.ip}:3001/launch`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ program: programId })
			});

			const data = await res.json()

			if (res.ok) {
				this.setState({ status: data.message })
			} else {
				this.setState({ status: `Помилка: ${data.error}` })
			}
		} catch (e) {
			this.setState({ status: 'Помилка з’єднання з сервером' })
		}
	}

	async handleProgramIdChange(id) {
		this.setState({ newProgramId: id })
	}

	async handleProgramLabelChange(label) {
		this.setState({ newProgramLabel: label })
	}

	async handleEditIdChange(id, value) {
		this.setState(prev => ({
			editIds: { ...prev.editIds, [id]: value }
		}))
	}

	async handleEditCommandChange(id, value) {
		this.setState(prev => ({
			editCommands: { ...prev.editCommands, [id]: value }
		}))
	}

	async handleImageChange(file) {
		this.setState({
			newProgramImageFile: file
		})
	}

	async handleEditImageChange(id, file) {
		this.setState(prev => ({
			editImages: { ...prev.editImages, [id]: file }
		}))
	}


	async loadPrograms(ip) {
		try {
			const res = await fetch(`https://${ip}:3001/programs`)
			const programs = await res.json()
			this.setState({ programs })
		} catch (e) {
			alert("Не вдалося оновити список програм")
		}
	}

	async handleAddProgram() {
		const { ip, newProgramId, newProgramLabel, newProgramImageFile } = this.state
		let filename = ""

		if (newProgramImageFile) {
			const formData = new FormData()

			formData.append("image", newProgramImageFile)

			try {
				const uploadRes = await fetch(`https://${ip}:3001/upload-image`, {
					method: "POST",
					body: formData,
				})

				const uploadData = await uploadRes.json()

				filename = uploadData.filename
			} catch (err) {
				console.error("Помилка завантаження зображення:", err)
			}
		}

		await fetch(`https://${ip}:3001/add-program`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
			id: newProgramId,
			command: newProgramId,
			label: newProgramLabel,
			image: filename,
			}),
		})

		this.setState(
			{
				newProgramId: "",
				newProgramLabel: "",
				newProgramImageFile: null,
			},
			() => this.loadPrograms(ip)
		)
	}

	async handleEditProgram(originalId) {
		const newId = this.state.editIds[originalId]
		const newCommand = this.state.editCommands[originalId]
		const newImageFile = this.state.editImages[originalId]
		const { ip } = this.state

		const formData = new FormData()
		formData.append("id", originalId)
		formData.append("newId", newId)
		formData.append("newCommand", newCommand)

		if (newImageFile) {
			formData.append("image", newImageFile)
		}

		try {
			const res = await fetch(`https://${ip}:3001/edit-program`, {
				method: 'PUT',
				body: formData
			})

			const data = await res.json()

			if (!res.ok) return alert(data.error)

			const refreshed = await fetch(`https://${ip}:3001/programs`)
			const updatedPrograms = await refreshed.json()

			this.setState({ programs: updatedPrograms })
		} catch (e) {
			alert('Помилка оновлення програми')
		}
	}

	async handleDeleteProgram(id) {
		const { ip } = this.state;

		try {
			const res = await fetch(`https://${ip}:3001/delete-program/${id}`, {
				method: 'DELETE'
			})

			const data = await res.json()

			if (!res.ok) return alert(data.error)

			const refreshed = await fetch(`https://${ip}:3001/programs`)
			const updatedPrograms = await refreshed.json()

			this.setState({ programs: updatedPrograms })
		} catch (e) {
			alert('Помилка видалення програми')
		}
	}

	handleSelectedIpChange = (e) => {
		this.setState({ selectedIp: e.target.value })
	}

	handleChangePage(page) {
		this.setState({
			page: page
		})
	}

	renderPage() {
		switch (this.state.page) {
			case 'programs':
				return (
					<ProgramsList
						programs={this.state.programs}
						launchProgram={this.launchProgram}
						ip={this.state.ip}
					/>
				)
			case 'add':
				return (
					<AddProgram
						handleProgramIdChange={this.handleProgramIdChange}
						handleProgramLabelChange={this.handleProgramLabelChange}
						handleAddProgram={this.handleAddProgram}
						newProgramId={this.state.newProgramId}
						newProgramLabel={this.state.newProgramLabel}
						handleImageChange={this.handleImageChange}
					/>
				)
			case 'edit':
				return (
					<EditProgram
						programs={this.state.programs}
						editIds={this.state.editIds}
						editCommands={this.state.editCommands}
						handleEditIdChange={this.handleEditIdChange}
						handleEditCommandChange={this.handleEditCommandChange}
						handleEditProgram={this.handleEditProgram}
						handleEditImageChange={this.handleEditImageChange}
					/>
				)
			case 'delete':
				return (
					<DeleteProgram
						programs={this.state.programs}
						handleDeleteProgram={this.handleDeleteProgram.bind(this)}
					/>
				)
			default:
				return <div>Programs</div>
		}
	}

	render() {
		if (!this.state.isConnected) {
			return (
				<Connect
					selectedIp={this.state.selectedIp}
					handleSelectedIpChange={this.handleSelectedIpChange}
					connectToServer={this.connectToServer}
				/>
			)
		}

		return (
			<>
				<Header page={this.state.page} handleChangePage={this.handleChangePage} />

				<div className="main-wrapper">
					<main>
						<div className="container">
							{this.renderPage()}
						</div>
					</main>
				</div>
			</>
		)
	}
}


export default App
