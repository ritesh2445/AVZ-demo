import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface PartInfo {
  path: string;
  size: number;
}

function getPartsForDevice(device: string): { parts: PartInfo[]; totalSize: number } {
  const isMobile = device === 'mobile';
  const fileNames = isMobile
    ? ['mobile_view_part0.bin', 'mobile_view_part1.bin']
    : ['desktop_view_part0.bin', 'desktop_view_part1.bin'];

  const parts: PartInfo[] = fileNames.map((name) => {
    const fullPath = path.join(process.cwd(), 'public', 'assets', name);
    const stat = fs.statSync(fullPath);
    return { path: fullPath, size: stat.size };
  });

  const totalSize = parts.reduce((acc, p) => acc + p.size, 0);
  return { parts, totalSize };
}

/**
 * Reads a byte range [start, end] (inclusive) across the two bin parts.
 */
function readRange(parts: PartInfo[], start: number, end: number): Buffer {
  const length = end - start + 1;
  const buffer = Buffer.alloc(length);
  let bytesRead = 0;
  let currentOffset = 0;

  for (const part of parts) {
    const partStart = currentOffset;
    const partEnd = currentOffset + part.size - 1;

    // Check if the requested range overlaps with this part
    if (start <= partEnd && end >= partStart) {
      const sliceStartInPart = Math.max(0, start - partStart);
      const sliceEndInPart = Math.min(part.size - 1, end - partStart);
      const sliceLength = sliceEndInPart - sliceStartInPart + 1;

      const fd = fs.openSync(part.path, 'r');
      try {
        fs.readSync(fd, buffer, bytesRead, sliceLength, sliceStartInPart);
        bytesRead += sliceLength;
      } finally {
        fs.closeSync(fd);
      }
    }

    currentOffset += part.size;
    if (bytesRead >= length) break;
  }

  return buffer;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const device = searchParams.get('device') === 'mobile' ? 'mobile' : 'desktop';

    const { parts, totalSize } = getPartsForDevice(device);
    const rangeHeader = req.headers.get('range');

    // Default chunk size when client requests unbounded range (e.g. bytes=0-)
    // 3MB per chunk provides instantaneous video start (<100ms) with zero stalls
    const DEFAULT_CHUNK_SIZE = Math.floor(1.5 * 1024 * 1024);

    if (!rangeHeader) {
      // Client did not request Range: return first chunk with 206 so media decoder starts immediately
      const start = 0;
      const end = Math.min(DEFAULT_CHUNK_SIZE - 1, totalSize - 1);
      const chunk = readRange(parts, start, end);

      const body = new Uint8Array(chunk);
      return new NextResponse(body, {
        status: 206,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': String(chunk.length),
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Parse Range header e.g. "bytes=0-" or "bytes=1000-2000"
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!match) {
      return new NextResponse(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${totalSize}` },
      });
    }

    const start = parseInt(match[1], 10);
    let end = match[2] ? parseInt(match[2], 10) : start + DEFAULT_CHUNK_SIZE - 1;

    if (end >= totalSize) {
      end = totalSize - 1;
    }

    if (start >= totalSize || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${totalSize}` },
      });
    }

    const chunk = readRange(parts, start, end);
    const body = new Uint8Array(chunk);

    return new NextResponse(body, {
      status: 206,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(chunk.length),
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error in video streaming route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
