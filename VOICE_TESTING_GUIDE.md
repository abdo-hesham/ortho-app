# Voice Recording Testing Guide

## Prerequisites

1. **OpenAI API Key Setup**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add to `.env.local`:
     ```
     OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
     ```
   - Restart the development server after adding the key

2. **Browser Requirements**
   - Chrome/Edge (recommended for best MediaRecorder support)
   - Firefox (good support)
   - Safari (basic support)
   - HTTPS required for microphone access (or localhost)

3. **Microphone Access**
   - Ensure your browser has microphone permissions
   - Check browser settings if permission is denied
   - Use good quality microphone for best results

## Testing Steps

### 1. Basic Voice Recording Flow

1. Open the Add Patient modal
2. Click the blue microphone button in the header
3. **Grant microphone permission** when prompted
4. Speak your patient information (see sample scripts below)
5. Click the red pulsing microphone to stop recording
6. Wait for processing (spinning icon)
7. Verify auto-filled form fields

### 2. Sample Voice Scripts

**Script 1 - Complete Patient (Tests All Fields)**
```
"Patient name: John Michael Smith. Age: 45 years old. Diagnosed with distal radial fracture. 
Underwent open reduction internal fixation at City Medical Center. Expectations are good 
healing with full range of motion. First follow-up in 2 weeks for wound check. Second follow-up 
in 6 weeks for K-wire removal. Third follow-up in 12 weeks for final X-ray. Patient is on 
pain medication and wearing a splint that needs changing in 3 weeks."
```

**Script 2 - Minimal Patient (Tests Required Fields)**
```
"Patient Sarah Johnson, 32 years old, diagnosed with carpal tunnel syndrome, 
underwent carpal tunnel release at General Hospital."
```

**Script 3 - Medical Terminology Heavy (Tests Accuracy)**
```
"Patient David Lee, 58, presenting with comminuted metacarpal fracture. Underwent 
percutaneous pinning at University Hospital. Scheduled for K-wire removal in 4 weeks, 
suture removal in 2 weeks, and splint change in 1 week."
```

### 3. Expected Behavior

#### During Recording
- ✅ Button turns red with pulsing animation
- ✅ Duration counter displays (MM:SS format)
- ✅ Recording continues until stopped manually
- ✅ Close button and form fields remain disabled

#### During Processing
- ✅ Spinning icon appears
- ✅ "Processing..." or similar indicator
- ✅ Form fields still disabled
- ✅ Takes 2-10 seconds depending on audio length

#### After Success
- ✅ Microphone button returns to blue (ready state)
- ✅ Form fields auto-populate with extracted data
- ✅ Only fields mentioned in speech are filled
- ✅ Existing manual entries are preserved
- ✅ Field errors clear for successfully filled fields

### 4. Field Mapping Tests

| Voice Input | Expected Field | Notes |
|-------------|----------------|-------|
| "Patient name John Smith" | `patientName` | Capitalizes properly |
| "45 years old" or "45yo" | `age` | Extracts numbers only |
| "diagnosed with fracture" | `diagnosis` | Capitalizes first letter |
| "underwent ORIF" | `procedure` | Preserves medical abbreviations |
| "at City Hospital" | `hospital` | Capitalizes words |
| "expectations are good" | `expectations` | Full sentence preserved |
| "follow up in 2 weeks" | `followUp1Value` (2), `followUp1Unit` (weeks) | Splits value/unit |
| "K-wire removal in 4 weeks" | `kwireRemovalValue` (4), `kwireRemovalUnit` (weeks) | Medical term recognition |
| "splint change in 3 weeks" | `splintChangeValue`, `splintChangeUnit` | Treatment schedule |
| "suture removal 10 days" | `sutureRemovalValue`, `sutureRemovalUnit` | Time parsing |

### 5. Error Handling Tests

#### Test Case: Microphone Permission Denied
1. Block microphone in browser settings
2. Click recording button
3. **Expected**: Red error message appears
4. **Error text**: "Permission denied" or similar

#### Test Case: No OpenAI API Key
1. Remove `OPENAI_API_KEY` from `.env.local`
2. Record audio
3. **Expected**: Error after processing attempt
4. **Error text**: "Failed to transcribe audio"

#### Test Case: Network Error
1. Disable internet connection
2. Record and stop audio
3. **Expected**: Error message during processing
4. **Error text**: Network or API error

#### Test Case: Audio Too Short
1. Click microphone
2. Immediately stop (< 1 second)
3. **Expected**: May fail or return empty transcription
4. **Behavior**: Form remains unchanged

#### Test Case: Audio Too Long (>25MB)
1. Record for extended period (>15 minutes)
2. **Expected**: File size validation error
3. **Error text**: "Audio file too large"

### 6. Browser Compatibility

| Browser | Recording | Transcription | Notes |
|---------|-----------|---------------|-------|
| Chrome 92+ | ✅ | ✅ | Best support, audio/webm;codecs=opus |
| Edge 92+ | ✅ | ✅ | Same as Chrome (Chromium) |
| Firefox 88+ | ✅ | ✅ | Uses audio/webm or audio/ogg |
| Safari 14+ | ⚠️ | ✅ | May use different MIME type |
| Mobile Chrome | ✅ | ✅ | Requires HTTPS |
| Mobile Safari | ⚠️ | ✅ | Limited MediaRecorder support |

### 7. Audio Quality Verification

Check browser console for audio settings:
```
MediaRecorder initialized with:
- MIME type: audio/webm;codecs=opus
- Sample rate: 48000 Hz
- Audio bitrate: 128000 bps
- Channels: 1 (mono)
```

### 8. Performance Benchmarks

| Recording Length | Expected Processing Time | File Size |
|------------------|-------------------------|-----------|
| 10 seconds | 2-3 seconds | ~160 KB |
| 30 seconds | 4-6 seconds | ~480 KB |
| 1 minute | 6-10 seconds | ~960 KB |
| 5 minutes | 15-30 seconds | ~4.8 MB |

### 9. Common Issues & Solutions

#### Issue: "getUserMedia is not defined"
- **Cause**: Not using HTTPS or localhost
- **Solution**: Use `https://` or `localhost:3000`

#### Issue: Transcription is empty
- **Cause**: Background noise, poor microphone
- **Solution**: Use quieter environment, check mic levels

#### Issue: Medical terms not recognized
- **Cause**: Unclear pronunciation
- **Solution**: Speak clearly, use common medical abbreviations

#### Issue: Fields not auto-filling
- **Cause**: Parser patterns not matching
- **Solution**: Check console for parsed output, adjust voice script

#### Issue: "Failed to start recording"
- **Cause**: Microphone in use by another app
- **Solution**: Close other apps using microphone

### 10. Advanced Testing

#### Concurrent Recording Prevention
1. Click microphone to start recording
2. Try clicking again while recording
3. **Expected**: Second click stops current recording
4. **Behavior**: One recording at a time

#### Form State Preservation
1. Manually fill in patient name and age
2. Record voice with diagnosis and procedure
3. **Expected**: Manual entries preserved, new fields added

#### Error Recovery
1. Trigger an error (e.g., deny permission)
2. Fix the issue
3. Try recording again
4. **Expected**: Error clears, recording works normally

## Debugging Console Logs

Enable detailed logging in `useVoiceRecording.ts`:
```typescript
console.log('Audio blob size:', audioBlob.size);
console.log('Audio MIME type:', audioBlob.type);
console.log('Transcription response:', data);
console.log('Parsed patient data:', parsePatientTranscription(data.text));
```

## API Response Structure

Successful transcription returns:
```json
{
  "text": "Patient John Smith, 45 years old...",
  "duration": 12.5,
  "language": "en"
}
```

Parser output (check console):
```javascript
{
  patientName: "John Smith",
  age: "45",
  diagnosis: "Radial fracture",
  procedure: "ORIF",
  hospital: "City Hospital",
  expectations: "Good recovery with full range of motion",
  followUp1Value: "2",
  followUp1Unit: "weeks",
  // ... more fields
}
```

## Security Checklist

- [ ] `.env.local` file ignored by git
- [ ] API key never committed to repository
- [ ] HTTPS used in production
- [ ] Microphone permission requested explicitly
- [ ] Audio data sent securely to API
- [ ] No audio stored on client after transcription

## Success Criteria

✅ Microphone permission granted without issues
✅ Recording indicator visible and accurate
✅ Duration counter updates every second
✅ Processing state shows appropriate feedback
✅ Transcription completes in <10 seconds for 1-minute audio
✅ At least 80% of fields correctly populated
✅ Medical terminology preserved accurately
✅ Errors handled gracefully with clear messages
✅ Form remains usable after voice input
✅ Manual editing still possible after voice input
