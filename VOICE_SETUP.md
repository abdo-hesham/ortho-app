# Voice Recording Setup - Quick Start

## 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-proj-...`)

## 2. Add API Key to Environment

Open `.env.local` and replace the placeholder:

```env
OPENAI_API_KEY=sk-proj-your_actual_api_key_here
```

**Important**: Never commit this file to git!

## 3. Restart Development Server

```bash
# Stop the current server (Ctrl + C)
# Then restart:
pnpm dev
```

## 4. Test Voice Recording

1. Open the application at `http://localhost:3000`
2. Navigate to the Dashboard
3. Click "Add New Patient"
4. Click the blue microphone icon in the top-right of the modal
5. Grant microphone permission when prompted
6. Speak your patient information clearly:
   
   **Example**: 
   > "Patient name John Smith, 45 years old, diagnosed with radial fracture, 
   > underwent open reduction internal fixation at City Hospital. 
   > Expectations are good recovery. Follow up in 2 weeks for wound check."

7. Click the red microphone to stop recording
8. Wait 2-10 seconds for processing
9. Verify that form fields are auto-filled

## 5. Troubleshooting

### Error: "Failed to transcribe audio"
- Check that `OPENAI_API_KEY` is set correctly in `.env.local`
- Verify the API key is valid (not revoked)
- Check your OpenAI account has credits

### Error: "Permission denied"
- Allow microphone access in browser settings
- Ensure you're using HTTPS or localhost
- Check that no other app is using the microphone

### No fields auto-filled
- Speak more clearly and slowly
- Use medical terminology correctly
- Check browser console for parsing output
- See VOICE_TESTING_GUIDE.md for sample scripts

## Features

- ✅ **Medical-Grade Audio**: 48kHz sample rate, noise suppression
- ✅ **Smart Parsing**: Automatically extracts patient data from natural speech
- ✅ **Visual Feedback**: Recording indicator, duration counter, processing state
- ✅ **Error Handling**: Clear error messages for all failure cases
- ✅ **Preserves Manual Input**: Voice input merges with existing form data

## Audio Settings

The recorder uses optimal settings for medical dictation:
- Sample Rate: 48,000 Hz (high clarity)
- Bitrate: 128 kbps (high quality)
- Noise Suppression: ✅ Enabled
- Echo Cancellation: ✅ Enabled
- Auto Gain Control: ✅ Enabled

## What You Can Say

The voice parser recognizes:
- Patient names and ages
- Medical diagnoses (fractures, syndromes, conditions)
- Surgical procedures (ORIF, arthroscopy, etc.)
- Hospital/clinic names
- Follow-up schedules (2 weeks, 6 weeks, etc.)
- Treatment plans (K-wire removal, splint changes, sutures)

See [VOICE_TESTING_GUIDE.md](./VOICE_TESTING_GUIDE.md) for comprehensive testing scenarios.

## Next Steps

- Test with real patient scenarios
- Adjust parsing patterns if needed (see `src/lib/utils/transcriptionParser.ts`)
- Consider implementing GPT-based parsing for better accuracy
- Add voice input to other forms as needed
