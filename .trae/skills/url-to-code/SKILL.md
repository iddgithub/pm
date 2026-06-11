---
name: "url-to-code"
description: "Generates code from a URL by scraping and analyzing the content. Invoke when user asks to convert a webpage to code or replicate a website."
---

# URL to Code

## Overview
This skill helps you generate code from a webpage URL. It scrapes the content, analyzes the structure, and creates corresponding code files.

## Trigger
Use this skill when the user asks to:
- Convert a webpage/website to code
- Replicate/reproduce a website from a URL
- Scrape a URL and generate code from it
- Clone a webpage structure

## Process

### Step 1: Ask for the URL
First, ask the user to provide the URL they want to convert.

### Step 2: Scrape and analyze the URL
Use the `WebFetch` tool to retrieve and analyze the webpage content.

### Step 3: Plan the code structure
Decide what type of code to generate based on the webpage:
- React component
- HTML/CSS page
- Full web application

### Step 4: Generate the code
Create the appropriate code files in the workspace.

### Step 5: Verify
Confirm the files were created and tell the user how to use them.

## Output Types
Depending on the URL content, generate:
- React components (.jsx/.tsx)
- HTML files with inline CSS
- CSS/SCSS stylesheets
- JavaScript/TypeScript logic
