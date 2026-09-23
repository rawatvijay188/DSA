import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'progress.json');

function read(): Record<string, boolean> {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function write(data: Record<string, boolean>) {
  fs.writeFileSync(FILE, JSON.stringify(data), 'utf-8');
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  write(body);
  return NextResponse.json({ ok: true });
}
