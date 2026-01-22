#!/usr/bin/env python3
"""
Generate PNG icons for the Site Simplifier Chrome extension.
This script creates simple colored icons without external dependencies.

For production, replace these with properly designed icons from the SVG source.
"""

import struct
import zlib
import os

def create_png(width, height, color_rgb):
    """Create a simple solid-color PNG image."""

    def make_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc

    # PNG signature
    signature = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr = make_chunk(b'IHDR', ihdr_data)

    # IDAT chunk (image data)
    raw_data = b''
    r, g, b = color_rgb
    for y in range(height):
        raw_data += b'\x00'  # Filter byte
        for x in range(width):
            # Create a gradient effect for visual interest
            center_x, center_y = width // 2, height // 2
            dist = ((x - center_x) ** 2 + (y - center_y) ** 2) ** 0.5
            max_dist = (center_x ** 2 + center_y ** 2) ** 0.5

            # Inner circle (lighter)
            if dist < width * 0.35:
                raw_data += bytes([min(255, r + 40), min(255, g + 40), min(255, b + 40)])
            # Main color
            elif dist < width * 0.47:
                raw_data += bytes([r, g, b])
            # Outer edge (slightly darker)
            else:
                factor = min(1.0, (dist - width * 0.47) / (width * 0.1))
                raw_data += bytes([
                    max(0, int(r * (1 - factor * 0.3))),
                    max(0, int(g * (1 - factor * 0.3))),
                    max(0, int(b * (1 - factor * 0.3)))
                ])

    compressed = zlib.compress(raw_data, 9)
    idat = make_chunk(b'IDAT', compressed)

    # IEND chunk
    iend = make_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend


def main():
    # Icon sizes for Chrome extension
    sizes = [16, 32, 48, 128]

    # Brand color (blue)
    color = (74, 108, 247)  # #4a6cf7

    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(os.path.dirname(script_dir), 'icons')

    # Create icons directory if it doesn't exist
    os.makedirs(icons_dir, exist_ok=True)

    for size in sizes:
        filename = os.path.join(icons_dir, f'icon{size}.png')
        png_data = create_png(size, size, color)

        with open(filename, 'wb') as f:
            f.write(png_data)

        print(f'Created {filename}')

    print('\nIcon generation complete!')
    print('Note: For production, replace these with properly designed icons from icon.svg')


if __name__ == '__main__':
    main()
