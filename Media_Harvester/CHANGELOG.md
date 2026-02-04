---
title: "Changelog - Media_Harvester"
galaxy: "TOOLS"
galaxy-color: "#FFD700"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "changelog"
  - "changelog - media_harvester"
  - "[1.1.0] - 2026-01-19"
  - "changed"
  - "[1.0.0] - 2026-01-19"
  - "added"
tags:
  - "galaxy-tools"
  - "document"
---

# Changelog - Media_Harvester

## [1.1.0] - 2026-01-19
### Changed
- **Production Deployment:**
    - Migrated from `Z_Squad/outputs/Media_Harvester` to root directory
    - Added `meta/registry.yaml` for automatic discovery by eximia_runtime
    - Registered in `eximia_runtime/core/config.py` agents directory list
    - Status: Fully production-deployed alongside core agents
- **Deployment Method:** Direct implementation (Antigravity-assisted)
- **Validation:** Approved with 8.7/10 score

## [1.0.0] - 2026-01-19
### Added
- **Core Features:**
    - YouTube download via yt-dlp (single, search, playlist)
    - Smart transcription (subtitles → Whisper fallback)
    - Batch processing with summary generation
    - Auto-categorization (interviews, podcasts, lectures, shorts)
    - Clone_Factory integration (compatible output format)
    - Local file transcription support
- **Commands:**
    - `single` - Download single video
    - `search` - Batch search and download
    - `playlist` - Download entire playlist
    - `transcribe` - Transcribe local audio files
- **Technical Stack:**
    - yt-dlp for YouTube integration
    - faster-whisper for transcription (GPU/CPU)
    - ffmpeg for audio processing
    - Markdown output with Obsidian metadata
- **Documentation:**
    - Complete technical specification
    - Mental DNA and operational principles
    - 3 Knowledge Bases (download, transcription, formats)
    - Validation report (8.7/10 score)
- **Status:** Approved for production deployment

#galaxy-tools