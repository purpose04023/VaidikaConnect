@echo off
title VaidikaConnect - Batch AI Image Generator
echo ==========================================================
echo   VaidikaConnect - Batch AI Image Generator (Hugging Face)
echo ==========================================================
echo.
echo This script will generate beautiful, matching AI images for
echo all 68 default poojas and save them locally.
echo.
echo Press any key to start generating...
pause > nul
echo.
echo Generating images... (This might take a few minutes)
npx tsx scripts/generate-all-images.ts
echo.
echo ==========================================================
echo   Success! All images have been generated and saved.
echo ==========================================================
echo.
pause
