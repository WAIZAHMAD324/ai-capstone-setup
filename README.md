# Frontend Source-Grounded Study Notes Pipeline

A no-code AI workflow built during the FlyRank AI Internship to turn real source material into structured, source-grounded study notes (frontend-focused).

## Overview
This pipeline combines **NotebookLM** and a **Claude/ChatGPT Project** to break study-note creation into four stages:

**Gather → Synthesize → Draft → Review/Format**

The goal is to reduce repetitive reading and note-making while keeping **human verification** and accountability in the loop.

## Workflow

### 1) Gather — NotebookLM
A source document is uploaded into NotebookLM.

### 2) Synthesize — NotebookLM
NotebookLM is given a fixed Q&A set to extract:
- The core concept (plain language)
- The five most important points
- Possible professor/reviewer questions

### 3) Draft — Claude/ChatGPT Project
The synthesized material is transferred to a Project with structured instructions for producing consistent study notes.

### 4) Review/Format — Claude/ChatGPT Project
The generated notes are checked against the source for:
- Unsupported claims
- Missing information
- Oversimplification
- Accuracy

## Tools Used
- **NotebookLM** — source-grounded research and synthesis
- **Claude/ChatGPT Project** — structured drafting and review
- **Manual handoff** — copy/paste between the two tools

## Test Runs (5)
The pipeline was applied to five real inputs:
1. FL-01 — AI Workflow Audit  
2. FL-04 — Workflow vs. Agent and MCP  
3. FlyRank Portfolio / Proof Statement  
4. FlyRank Portfolio Content Map / Sitemap  
5. Frontend Todo UI / AI Frontend Engineering  

## Key Findings
The workflow provides a consistent way to transform source material into study notes without relying on a single AI prompt.  
The main limitation is the manual handoff between NotebookLM and the Project, so it is useful as a no-code workflow but not fully automated.  
Technical material can lose nuance during summarization, making the review stage important.

## Human Review
The generated notes are not treated as automatically submission-ready.  
Human verification is required, especially for graded work, technical material, and information that needs to be presented or relied upon.