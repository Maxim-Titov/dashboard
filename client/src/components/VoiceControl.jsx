import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa";

function withSpeechRecognition(WrappedComponent) {
    return function Wrapper(props) {
        const speechProps = useSpeechRecognition();
        return <WrappedComponent {...props} {...speechProps} />;
    }
}

class VoiceControl extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isListening: false
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
    }

    componentDidUpdate(prevProps) {
        if (prevProps.transcript !== this.props.transcript) {
            this.checkTranscriptForCommand(this.props.transcript)
        }
    }

    playSound = (sound) => {
        const audio = new Audio(sound)

        audio.play().catch((e) => {
            console.warn("Cannot play sound:", e)
        })
    }

    playRandomSound = (sounds) => {
        const randomIndex = Math.floor(Math.random() * sounds.length);
        const randomSound = sounds[randomIndex];

        const audio = new Audio(randomSound);
        audio.play().catch((e) => {
            console.warn("Cannot play sound:", e);
        });
    }

    startListening = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'uk-UA',
        })
    }

    checkTranscriptForCommand = (text) => {
        const normalized = text.toLowerCase().trim()

        if (normalized.includes("відкрий") || normalized.includes("запусти")) {
            for (const program of this.props.programs) {
                const labelMatch = program.label?.toLowerCase().trim()
                const idMatch = program.id?.toLowerCase().trim()

                if (normalized.includes(labelMatch) || normalized.includes(idMatch)) {
                    this.props.launchProgram(program.id)
                    this.props.resetTranscript()

                    this.playRandomSound(this.okSounds)

                    break
                }
            }
        }

        if (normalized.includes("альфред")) {
            this.props.resetTranscript()

            this.playRandomSound(this.greetSounds)
        }

        if (normalized.includes("дякую")) {
            this.props.resetTranscript()

            this.playSound('/sounds/thanks.wav')
        }
    }

    stopListening = () => {
        SpeechRecognition.stopListening();
    }

    renderButton() {
        switch (this.state.isListening) {
            case false:
                return (
                    <button onClick={() => {
                        this.props.resetTranscript()
                        this.startListening()
                        this.setState({
                            isListening: true
                        })
                    }}><FaMicrophone /></button>
                )
            case true:
                return (
                    <button onClick={() => {
                        this.stopListening()
                        this.setState({
                            isListening: false
                        })
                    }}><FaRegStopCircle /></button>
                )
            default:
                return Micro
        }
    }

    render() {
        const {
            browserSupportsSpeechRecognition,
            transcript,
            listening,
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
