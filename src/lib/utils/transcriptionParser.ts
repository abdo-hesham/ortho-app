/**
 * AI-powered field parser for medical transcriptions
 * Extracts structured data from voice input
 */

interface ParsedPatientData {
  patientName?: string;
  age?: string;
  diagnosis?: string;
  procedure?: string;
  hospital?: string;
  expectations?: string;
  followUpParameters?: string;
  kWireRemoval?: string;
  splintChangeRemoval?: string;
  typeAndSutureRemoval?: string;
  followUpFirst?: string;
  followUpSecond?: string;
  followUpThird?: string;
}

/**
 * Parse transcribed text and extract patient information
 * Uses pattern matching and medical terminology recognition
 */
export function parsePatientTranscription(text: string): ParsedPatientData {
  const data: ParsedPatientData = {};

  // Clean and normalize text
  const normalizedText = text.toLowerCase().trim();

  // Extract patient name
  const namePatterns = [
    /patient\s+(?:name\s+)?(?:is\s+)?([a-z]+(?:\s+[a-z]+)+)/i,
    /name\s+(?:is\s+)?([a-z]+(?:\s+[a-z]+)+)/i,
    /(?:this\s+is\s+)?([a-z]+\s+[a-z]+)(?:,|\s+age)/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.patientName = capitalizeWords(match[1].trim());
      break;
    }
  }

  // Extract age
  const agePatterns = [
    /age\s+(?:is\s+)?(\d+)(?:\s+years?)?/i,
    /(\d+)(?:\s+|-)?year(?:s)?(?:\s+old)?/i,
    /(\d+)\s*yo/i,
  ];
  for (const pattern of agePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const age = parseInt(match[1]);
      if (age > 0 && age < 150) {
        data.age = age.toString();
        break;
      }
    }
  }

  // Extract diagnosis
  const diagnosisPatterns = [
    /diagnosis\s+(?:is\s+)?[:\-]?\s*(.+?)(?:\.|procedure|treatment|hospital|$)/i,
    /diagnosed\s+with\s+(.+?)(?:\.|procedure|treatment|hospital|$)/i,
    /presenting\s+with\s+(.+?)(?:\.|procedure|treatment|hospital|$)/i,
  ];
  for (const pattern of diagnosisPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.diagnosis = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract procedure
  const procedurePatterns = [
    /procedure\s+(?:is\s+)?[:\-]?\s*(.+?)(?:\.|hospital|follow|expected|$)/i,
    /(?:underwent|undergoing|scheduled for)\s+(.+?)(?:\.|hospital|follow|expected|$)/i,
    /surgery\s+(?:is\s+)?[:\-]?\s*(.+?)(?:\.|hospital|follow|expected|$)/i,
  ];
  for (const pattern of procedurePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.procedure = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract hospital
  const hospitalPatterns = [
    /hospital\s+(?:is\s+)?[:\-]?\s*(.+?)(?:\.|expect|follow|scheduled|$)/i,
    /at\s+([a-z\s]+(?:hospital|medical center|clinic))/i,
    /admitted\s+to\s+(.+?hospital)/i,
  ];
  for (const pattern of hospitalPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.hospital = capitalizeWords(match[1].trim());
      break;
    }
  }

  // Extract expectations
  const expectationPatterns = [
    /expect(?:ation)?s?\s+(?:is|are|include)?\s*[:\-]?\s*(.+?)(?:\.|follow|parameter|k-wire|splint|$)/i,
    /anticipated\s+(.+?)(?:\.|follow|parameter|k-wire|splint|$)/i,
    /goal(?:s)?\s+(?:is|are|include)?\s*[:\-]?\s*(.+?)(?:\.|follow|parameter|k-wire|splint|$)/i,
  ];
  for (const pattern of expectationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.expectations = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract follow-up parameters
  const parameterPatterns = [
    /(?:follow(?:-|\s)?up\s+)?parameter(?:s)?\s+(?:is|are|include)?\s*[:\-]?\s*(.+?)(?:\.|k-wire|splint|suture|first follow|$)/i,
    /monitor(?:ing)?\s+(.+?)(?:\.|k-wire|splint|suture|first follow|$)/i,
  ];
  for (const pattern of parameterPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.followUpParameters = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract K-wire removal
  const kWirePatterns = [
    /k(?:-|\s)?wire\s+removal\s+(?:at\s+)?(.+?)(?:\.|splint|suture|follow|$)/i,
    /remove\s+k(?:-|\s)?wire\s+(?:at\s+)?(.+?)(?:\.|splint|suture|follow|$)/i,
  ];
  for (const pattern of kWirePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.kWireRemoval = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract splint change/removal
  const splintPatterns = [
    /splint\s+(?:change|removal)\s+(?:at\s+)?(.+?)(?:\.|suture|k-wire|follow|$)/i,
    /change\s+splint\s+(?:at\s+)?(.+?)(?:\.|suture|k-wire|follow|$)/i,
  ];
  for (const pattern of splintPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.splintChangeRemoval = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract suture removal
  const suturePatterns = [
    /suture\s+removal\s+(?:at\s+)?(.+?)(?:\.|splint|k-wire|follow|$)/i,
    /remove\s+suture(?:s)?\s+(?:at\s+)?(.+?)(?:\.|splint|k-wire|follow|$)/i,
    /(?:absorbable|non-absorbable)\s+suture(?:s)?\s+(.+?)(?:\.|splint|k-wire|follow|$)/i,
  ];
  for (const pattern of suturePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.typeAndSutureRemoval = capitalizeFirst(match[1].trim());
      break;
    }
  }

  // Extract follow-up appointments
  const followUpPatterns = [
    /first\s+follow(?:-|\s)?up\s+(.+?)(?:\.|second|third|$)/i,
    /second\s+follow(?:-|\s)?up\s+(.+?)(?:\.|third|first|$)/i,
    /third\s+follow(?:-|\s)?up\s+(.+?)(?:\.|second|first|$)/i,
  ];

  const firstMatch = text.match(followUpPatterns[0]);
  if (firstMatch && firstMatch[1]) {
    data.followUpFirst = capitalizeFirst(firstMatch[1].trim());
  }

  const secondMatch = text.match(followUpPatterns[1]);
  if (secondMatch && secondMatch[1]) {
    data.followUpSecond = capitalizeFirst(secondMatch[1].trim());
  }

  const thirdMatch = text.match(followUpPatterns[2]);
  if (thirdMatch && thirdMatch[1]) {
    data.followUpThird = capitalizeFirst(thirdMatch[1].trim());
  }

  return data;
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize each word in string
 */
function capitalizeWords(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Alternative: Use OpenAI GPT for intelligent parsing
 * This is more accurate but requires additional API call
 */
export async function parseWithGPT(
  transcription: string,
): Promise<ParsedPatientData> {
  try {
    const response = await fetch("/api/parse-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: transcription }),
    });

    if (!response.ok) {
      throw new Error("Failed to parse with GPT");
    }

    return await response.json();
  } catch (error) {
    console.error("GPT parsing error:", error);
    // Fallback to pattern matching
    return parsePatientTranscription(transcription);
  }
}
