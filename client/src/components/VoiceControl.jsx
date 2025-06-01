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
    }

    componentDidUpdate(prevProps) {
        if (prevProps.transcript !== this.props.transcript) {
            this.checkTranscriptForCommand(this.props.transcript)
        }
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
                    break
                }
            }
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
