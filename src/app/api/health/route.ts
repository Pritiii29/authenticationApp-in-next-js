import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    const connectionState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return NextResponse.json({
      status: 'success',
      database: {
        connected: connectionState === 1,
        state: states[connectionState as keyof typeof states],
        readyState: connectionState
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
