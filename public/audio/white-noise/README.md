# White Noise Audio Files

Place your audio files in this folder with the following names:

| File Name      | Description                    | Recommended Format |
|----------------|--------------------------------|--------------------|
| `rain.mp3`     | Rain sounds                    | MP3 or WAV         |
| `ocean.mp3`    | Ocean waves                    | MP3 or WAV         |
| `forest.mp3`   | Forest ambience (birds, etc.)  | MP3 or WAV         |
| `wind.mp3`     | Wind sounds                    | MP3 or WAV         |
| `fireplace.mp3`| Crackling fireplace            | MP3 or WAV         |
| `cafe.mp3`     | Café background ambience       | MP3 or WAV         |

## Recommended Sources for Royalty-Free Audio

- [Freesound.org](https://freesound.org/) - Free sound effects (check license)
- [Pixabay](https://pixabay.com/sound-effects/) - Free for commercial use
- [Mixkit](https://mixkit.co/free-sound-effects/) - Free sound effects
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/) - Free for personal/educational use

## Audio Format Guide

### Supported Formats
- ✅ **MP3** - Best choice (small size, universal support)
- ✅ **WAV** - Works but larger files (10-20x bigger than MP3)
- ✅ **OGG** - Good alternative, but less universal support

### Format Comparison
| Format | File Size | Quality | Browser Support | Recommendation |
|--------|-----------|---------|-----------------|----------------|
| MP3    | Small     | Good    | Excellent       | ⭐ Recommended  |
| WAV    | Large     | Best    | Excellent       | Convert to MP3 |
| OGG    | Small     | Good    | Good            | Alternative    |

### Converting WAV to MP3

**Online Tools (Free, No Installation):**
- [CloudConvert](https://cloudconvert.com/wav-to-mp3) - Easy, fast
- [Online-Convert](https://audio.online-convert.com/convert-to-mp3)
- [FreeConvert](https://www.freeconvert.com/wav-to-mp3)

**Desktop Software:**
- **Audacity** (Free, Open Source)
  1. Download from [audacityteam.org](https://www.audacityteam.org/)
  2. Open WAV file
  3. File → Export → Export as MP3
  4. Set bitrate to 128-192 kbps

- **FFmpeg** (Command Line)
  ```bash
  ffmpeg -i input.wav -b:a 192k output.mp3
  ```

### Audio Optimization Tips

- **File Size:** Aim for 1-3 MB per file for web performance
- **Bitrate:** 128-192 kbps is perfect for ambient sounds
- **Looping:** Trim files to create seamless loops
- **Length:** 1-2 minutes is ideal for looping tracks
- **Sample Rate:** 44.1 kHz is standard

### Quick Start

1. Download WAV files from Freesound.org
2. Convert to MP3 using CloudConvert (if needed)
3. Rename to match the file names above
4. Drop files into this folder
5. Update the file extensions in `WhiteNoiseModal.tsx` if using WAV

## Adding New Sounds

To add more sound options:

1. Add the MP3 file to this folder
2. Update the `WHITE_NOISE_OPTIONS` array in `src/components/white-noise/WhiteNoiseModal.tsx`
3. Add an appropriate icon from lucide-react

Example:
```typescript
{
    id: 'thunder',
    name: 'Thunderstorm',
    icon: CloudLightning, // import from lucide-react
    file: '/audio/white-noise/thunder.mp3',
    color: 'bg-purple-500',
},
```
