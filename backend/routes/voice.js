import express from "express"
import { parseVoiceInput } from "../services/voiceParser.js"

const router = express.Router()

// Parse voice input
router.post("/parse", async (req, res) => {
  try {
    const { transcript } = req.body

    if (!transcript || transcript.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      })
    }

    const parsed = await parseVoiceInput(transcript)
    res.json({ success: true, data: parsed })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
