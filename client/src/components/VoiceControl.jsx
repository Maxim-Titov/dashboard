import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa"
import Fuse from 'fuse.js'

function withSpeechRecognition(WrappedComponent) {
    return function Wrapper(props) {
        const speechProps = useSpeechRecognition()
        return <WrappedComponent {...props} {...speechProps} />
    }
}

class VoiceControl extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isSpeaking: false,
            shouldListenAfterSound: true, // новий прапорець
        }

        this.okSounds = [
            '/sounds/ok1.wav',
            '/sounds/ok2.wav',
            '/sounds/ok3.wav',
            '/sounds/ok4.wav'
        ]

        this.greetSounds = [
            '/sounds/greet1.wav',
            '/sounds/greet2.wav',
            '/sounds/greet3.wav'
        ]

        this.playSound = this.playSound.bind(this)
    }

    componentDidUpdate(prevProps) {
        const finishedSpeaking = prevProps.listening && !this.props.listening
        const hasTranscript = this.props.transcript && this.props.transcript.trim() !== ''

        if (finishedSpeaking && hasTranscript && !this.state.isSpeaking) {
            this.checkTranscriptForCommand(this.props.transcript)
        }
    }

    findBestMatchingProgram = (spokenText) => {
        const programNames = this.props.programs.map(p => ({
            id: p.id,
            label: p.label
        }))

        const fuse = new Fuse(programNames, {
            keys: ['label', 'id'],
            threshold: 0.4,
        })

        const results = fuse.search(spokenText);

        if (results.length > 0) {
            return results[0].item
        }

        return null
    }

    playSound = (sound, callback) => {
        this.setState({ isSpeaking: true })

        SpeechRecognition.stopListening()

        const audio = new Audio(sound)

        const resumeListening = () => {
            this.setState({ isSpeaking: false })

            // Враховуємо прапорець
            if (this.state.shouldListenAfterSound) {
                this.startListening()
            }

            if (typeof callback === 'function') callback()
        }

        audio.onended = resumeListening
        audio.onerror = (e) => {
            console.warn("Cannot play sound:", e)
            resumeListening()
        }

        audio.play().catch((e) => {
            console.warn("Cannot play sound:", e)
            resumeListening()
        })
    }

    playRandomSound = (sounds, callback) => {
        const randomIndex = Math.floor(Math.random() * sounds.length)
        const randomSound = sounds[randomIndex]
        this.playSound(randomSound, callback)
    }

    startListening = () => {
        SpeechRecognition.startListening({
            continuous: false,
            language: 'uk-UA',
        })
    }

    stopListening = () => {
        SpeechRecognition.stopListening()
    }

    checkTranscriptForCommand = (text) => {
        const normalized = text.toLowerCase().trim()

        const stopCommands = ['стоп', 'перестань слухати', 'вимкнись']

        if (normalized.includes("відкрий") || normalized.includes("запусти")) {
            const textAfterCommand = normalized
                .replace("відкрий", "")
                .replace("запусти", "")
                .trim()

            const programList = this.props.programs.map(p => ({
                id: p.id,
                label: p.label
            }))

            const fuse = new Fuse(programList, {
                keys: ['label', 'id'],
                threshold: 0.4
            })

            const results = fuse.search(textAfterCommand)

            if (results.length > 0) {
                const matchedProgram = results[0].item

                this.playRandomSound(this.okSounds, () => {
                    this.props.launchProgram(matchedProgram.id)
                    this.props.resetTranscript()
                })

                return
            } else {
                console.error("Error command")
                this.props.resetTranscript()
                return
            }
        }

        if (normalized === "альфред") {
            this.playRandomSound(this.greetSounds, () => {
                this.props.resetTranscript()
            })
            return
        }

        if (normalized.includes("дякую")) {
            this.playSound('/sounds/thanks.wav', () => {
                this.props.resetTranscript()
            })
            return
        }

        if (stopCommands.some(cmd => normalized.includes(cmd))) {
            this.setState({ shouldListenAfterSound: false }, () => {
                this.playSound('/sounds/greet1.wav', () => {
                    this.stopListening()
                    this.props.resetTranscript()
                })
            })
            return
        }

        this.playSound('/sounds/not_found.wav', () => {
            this.props.resetTranscript()
        })
    }

    renderButton() {
        const { listening } = this.props

        return listening ? (
            <button onClick={() => {
                this.stopListening()
            }}>
                <FaRegStopCircle />
            </button>
        ) : (
            <button onClick={() => {
                this.setState({ shouldListenAfterSound: true }, () => {
                    this.props.resetTranscript()
                    this.startListening()
                })
            }}>
                <FaMicrophone />
            </button>
        )
    }

    render() {
        const {
            browserSupportsSpeechRecognition,
            transcript,
        } = this.props

        if (!browserSupportsSpeechRecognition) {
            return <p>Your browser does not support speech recognition. 😢</p>
        }

        return (
            <div className='voice-controll-wrapper'>
                <div className="info">
                    <p className='info-text'>{transcript}</p>
                </div>
                {this.renderButton()}
            </div>
        )
    }
}

export default withSpeechRecognition(VoiceControl)
