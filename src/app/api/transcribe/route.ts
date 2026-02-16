/**
 * OpenAI Whisper Transcription API Route
 * Accepts audio files and returns transcribed text
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    // Get audio file from request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Validate file size (max 25MB for Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "Audio file too large. Maximum size is 25MB." },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "video/webm", // Sometimes webm is detected as video
    ];

    if (
      !allowedTypes.some((type) =>
        audioFile.type.startsWith(type.split("/")[0]),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid audio file type" },
        { status: 400 },
      );
    }

    console.log("Transcribing audio:", {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Convert File to format OpenAI expects
    const buffer = await audioFile.arrayBuffer();
    const file = new File([buffer], audioFile.name, { type: audioFile.type });

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en", // Specify English for medical terminology
      response_format: "verbose_json", // Get detailed response with timestamps
      temperature: 0, // More deterministic for medical accuracy
    });

    console.log("Transcription successful:", {
      text: transcription.text,
      duration: transcription.duration,
    });

    // Return transcribed text
    return NextResponse.json({
      text: transcription.text,
      duration: transcription.duration,
      language: transcription.language,
    });
  } catch (error) {
    console.error("Transcription error:", error);

    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: `OpenAI API error: ${error.message}`,
          status: error.status,
        },
        { status: error.status || 500 },
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to transcribe audio",
      },
      { status: 500 },
    );
  }
}

// Configure route
export const runtime = "nodejs"; // Use Node.js runtime for OpenAI SDK
export const maxDuration = 30; // Allow up to 30 seconds for transcription
