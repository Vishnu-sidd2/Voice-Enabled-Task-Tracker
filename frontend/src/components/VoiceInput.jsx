"use client"

import { useState, useRef, useEffect } from "react"
import VoicePreview from "./VoicePreview"
import "../styles/VoiceInput.css"

function VoiceInput({ onCreateTask, API_BASE_URL }) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [parsedData, setParsedData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")
  const [parsing, setParsing] = useState(false)

  const recognitionRef = useRef(null)
  const silenceTimerRef = useRef(null)

  // Initialize Web Speech API
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in your browser")
      return null
    }
    return new SpeechRecognition()
  }

  const startRecording = () => {
    setError("")
    setTranscript("")
    setParsedData(null)

    const recognition = initializeSpeechRecognition()
    if (!recognition) return

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    let interimTranscript = ""

    recognition.onstart = () => {
      setIsRecording(true)
      resetSilenceTimer()
    }

    recognition.onresult = (event) => {
      resetSilenceTimer()
      interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptSegment + " ")
        } else {
          interimTranscript += transcriptSegment
        }
      }
    }

    recognition.onerror = (event) => {
      clearSilenceTimer()
      setError(`Speech recognition error: ${event.error}`)
      setIsRecording(false)
    }

    recognition.onend = () => {
      clearSilenceTimer()
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = async () => {
    clearSilenceTimer()
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)

      setTimeout(async () => {
      }, 100)
    }
  }

  // Ref to keep track of latest transcript for the silence timer closure
  const transcriptRef = useRef("")
  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  const handleAutoStop = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)

      const finalTranscript = transcriptRef.current.trim()
      if (finalTranscript) {
        await parseTranscript(finalTranscript)
      }
    }
  }

  const resetSilenceTimer = () => {
    clearSilenceTimer()
    // Auto-stop after 3 seconds of silence
    silenceTimerRef.current = setTimeout(() => {
      handleAutoStop()
    }, 3000)
  }

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  // Manual stop
  const handleManualStop = async () => {
    clearSilenceTimer()
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)

      const finalTranscript = transcript.trim()
      if (finalTranscript) {
        await parseTranscript(finalTranscript)
      }
    }
  }

  const parseTranscript = async (text) => {
    setParsing(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/voice/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      })

      const result = await response.json()

      if (result.success) {
        setParsedData(result.data)
        setShowPreview(true)
      } else {
        setError(result.message || "Failed to parse voice input")
      }
    } catch (err) {
      setError("Error parsing voice input: " + err.message)
    } finally {
      setParsing(false)
    }
  }

  const handleClosePreview = () => {
    setShowPreview(false)
    setParsedData(null)
    setTranscript("")
  }

  const handleCreateTask = (data) => {
    if (onCreateTask) {
      onCreateTask(data)
    }
    handleClosePreview()
  }

  return (
    <>
      <div className="voice-input-container">
        <button
          className={`voice-btn ${isRecording ? "recording" : ""}`}
          onClick={isRecording ? handleManualStop : startRecording}
          disabled={parsing}
          title={isRecording ? "Click to stop recording" : "Click to start recording"}
        >
          <span className="voice-icon">{isRecording ? "⏹" : "🎤"}</span>
          <span className="voice-text">{isRecording ? "Stop" : "Voice"}</span>
        </button>

        {error && (
          <div className="voice-error">
            {error}
            <button className="error-close" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {parsing && <div className="voice-parsing">Parsing your voice input...</div>}

        {transcript && !showPreview && !parsing && !isRecording && (
          <div className="voice-transcript">
            <p>
              <strong>Heard:</strong> {transcript}
            </p>
            <button className="parse-btn" onClick={() => parseTranscript(transcript)} disabled={parsing}>
              Parse & Review
            </button>
          </div>
        )}
      </div>

      {showPreview && parsedData && (
        <VoicePreview
          transcript={transcript}
          parsedData={parsedData}
          onClose={handleClosePreview}
          onCreate={handleCreateTask}
          API_BASE_URL={API_BASE_URL}
        />
      )}
    </>
  )
}

export default VoiceInput
