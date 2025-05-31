import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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

    startListening = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'uk-UA',
        })
    }

    stopListening = () => {
        SpeechRecognition.stopListening();
    }

    renderButton() {
        switch (this.state.isListening) {
            case false:
                return (
                    <button onClick={() => {
                        this.startListening()
                        this.setState({
                            isListening: true
                        })
                    }}>🎙️ Start</button>
                )
            case true:
                return (
                    <button onClick={() => {
                        this.stopListening()
                        this.setState({
                            isListening: false
                        })
                    }}>⛔️ Stop</button>
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
            resetTranscript,
        } = this.props

        if (!browserSupportsSpeechRecognition) {
            return <p>Your browser does not support speech recognition. 😢</p>
        }

        return (
            <div>
                {this.renderButton()}

                <button onClick={resetTranscript}>♻️ Clear</button>
                <p><strong>Listening:</strong> {listening ? 'Yes' : 'No'}</p>
                <p><strong>Text:</strong> {transcript}</p>
            </div>
        )
    }
}

export default withSpeechRecognition(VoiceControl)
