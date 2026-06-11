---
name: "image-to-code"
description: "Generates code from an image/screenshot by analyzing the UI design. Invoke when user asks to convert an image to code or replicate a UI from a screenshot."
---

# Image to Code

## Overview
This skill helps you generate code from an image or screenshot of a UI design. It analyzes the visual elements and creates corresponding code files.

## Trigger
Use this skill when the user asks to:
- Convert an image/screenshot to code
- Replicate/reproduce a UI from an image
- Turn a design mockup into code
- Create code from a screenshot of a webpage/app

## Process

### Step 1: Ask for the image
First, ask the user to provide the image path or upload the image they want to convert.

### Step 2: Analyze the image
Examine the image to understand:
- Layout structure (columns, rows, sections)
- UI components (buttons, forms, cards, navigation)
- Colors, fonts, spacing
- Interactive elements

### Step 3: Plan the code structure
Decide what type of code to generate:
- React component
- HTML/CSS page
- Tailwind CSS implementation
- Full page/component

### Step 4: Generate the code
Create the appropriate code files in the workspace, matching the visual design.

### Step 5: Verify
Confirm the files were created and tell the user how to use them.

## Output Types
Depending on the image content, generate:
- React components (.jsx/.tsx)
- HTML files with inline CSS
- CSS/SCSS stylesheets
- Tailwind CSS implementations
- Responsive layouts
