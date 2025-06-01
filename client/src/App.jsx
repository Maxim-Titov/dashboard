import React from 'react'

import Connect from './components/Connect'
import Header from './components/Header'
import ProgramsList from './components/ProgramsList'
import VoiceControl from './components/VoiceControl'

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			page: 'programs', // 'prograps', 'voice'
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
			editImages: {},
			availableDevices: [],
			localIp: '',
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
		this.scanNetwork = this.scanNetwork.bind(this)
	}

	componentDidMount() {
		this.getLocalIPs((ips) => {
			if (ips.length > 0) {
				const localIp = ips[0]
				this.setState({ localIp })

				const subnet = localIp.split('.').slice(0, 3).join('.') + '.'
				this.scanNetwork(subnet)
			} else {
				this.scanNetwork('192.168.0.')
			}
		})
	}

	getLocalIPs = (callback) => {
		const ips = new Set()
		const pc = new RTCPeerConnection({ iceServers: [] })

		pc.createDataChannel('')
		pc.createOffer()
			.then(offer => pc.setLocalDescription(offer))
			.catch(() => { })

		pc.onicecandidate = (event) => {
			if (!event.candidate) {
				callback(Array.from(ips))

				return
			}
			const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
			const ipMatch = event.candidate.candidate.match(ipRegex)
			if (ipMatch) {
				ips.add(ipMatch[1])
			}
		};
	}

	scanNetwork = async (subnet) => {
		const foundDevices = []
		const promises = []

		for (let i = 1; i <= 254; i++) {
			const ip = subnet + i

			const p = new Promise((resolve) => {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => {
					controller.abort();
				}, 1000)

				fetch(`http://${ip}:3001/programs`, { signal: controller.signal })
					.then(res => {
						clearTimeout(timeoutId)
						if (res.ok) {
							foundDevices.push(ip)
						}
						resolve()
					})
					.catch(() => {
						clearTimeout(timeoutId)
						resolve()
					})
			})

			promises.push(p)
		}

		await Promise.all(promises)

		this.setState({ availableDevices: foundDevices })
	}

	playSound = (sound) => {
		const audio = new Audio(sound)

		audio.onerror = (e) => {
			console.warn("Cannot play sound:", e)
		}

		audio.play().catch((e) => {
			console.warn("Cannot play sound:", e)
		})
	}

	async connectToServer(ip) {
		try {
			const res = await fetch(`http://${ip}:3001/programs`)
			const programs = await res.json()

			this.setState({
				ip,
				isConnected: true,
				programs
			})

			this.playSound('/sounds/game_mode.wav')

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
			const res = await fetch(`http://${ip}:3001/programs`)
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
				const uploadRes = await fetch(`http://${ip}:3001/upload-image`, {
					method: "POST",
					body: formData,
				})

				const uploadData = await uploadRes.json()

				filename = uploadData.filename
			} catch (err) {
				console.error("Помилка завантаження зображення:", err)
			}
		}

		await fetch(`http://${ip}:3001/add-program`, {
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
			const res = await fetch(`http://${ip}:3001/edit-program`, {
				method: 'PUT',
				body: formData
			})

			const data = await res.json()

			if (!res.ok) return alert(data.error)

			const refreshed = await fetch(`http://${ip}:3001/programs`)
			const updatedPrograms = await refreshed.json()

			this.setState({ programs: updatedPrograms })
		} catch (e) {
			alert('Помилка оновлення програми')
		}
	}

	async handleDeleteProgram(id) {
		const { ip } = this.state;

		try {
			const res = await fetch(`http://${ip}:3001/delete-program/${id}`, {
				method: 'DELETE'
			})

			const data = await res.json()

			if (!res.ok) return alert(data.error)

			const refreshed = await fetch(`http://${ip}:3001/programs`)
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
						page={this.state.page}
						handleChangePage={this.handleChangePage}
						handleProgramIdChange={this.handleProgramIdChange}
						handleProgramLabelChange={this.handleProgramLabelChange}
						handleAddProgram={this.handleAddProgram}
						newProgramId={this.state.newProgramId}
						newProgramLabel={this.state.newProgramLabel}
						handleImageChange={this.handleImageChange}
						editIds={this.state.editIds}
						editCommands={this.state.editCommands}
						handleEditIdChange={this.handleEditIdChange}
						handleEditCommandChange={this.handleEditCommandChange}
						handleEditProgram={this.handleEditProgram}
						handleEditImageChange={this.handleEditImageChange}
						handleDeleteProgram={this.handleDeleteProgram.bind(this)}
					/>
				)
			case 'voice':
				return (
					<VoiceControl
						programs={this.state.programs}
						launchProgram={this.launchProgram}
					/>
				)
			default:
				return <div>Page</div>
		}
	}

	render() {
		if (!this.state.isConnected) {
			return (
				<Connect
					selectedIp={this.state.selectedIp}
					handleSelectedIpChange={this.handleSelectedIpChange}
					connectToServer={this.connectToServer}
					availableDevices={this.state.availableDevices}
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
