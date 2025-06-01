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
                        this.props.resetTranscript
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
                    {/* <p className='info-listening'><strong>Listening:</strong> {listening ? 'Yes' : 'No'}</p> */}
                    <p className='info-text'><strong>Text:</strong> {transcript}</p>
                </div>

                {this.renderButton()}
            </div>
        )
    }
}

export default withSpeechRecognition(VoiceControl)
