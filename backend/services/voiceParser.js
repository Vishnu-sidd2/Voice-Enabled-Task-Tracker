import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function debugLog(section, data) {
  const timestamp = new Date().toISOString();
  const logEntry = `
${"=".repeat(80)}
[${timestamp}] ${section}
${"=".repeat(80)}
${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}
${"=".repeat(80)}
`;
  
  console.log(logEntry);
  try {
    fs.appendFileSync("debug.log", logEntry + "\n");
  } catch (e) {
    console.error("Failed to write to debug.log:", e);
  }
}

export async function parseVoiceInput(transcript) {
  debugLog("STARTING PARSE", { transcript });
  
  try {
    // Check API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "YOUR_API_KEY_HERE") {
      debugLog("WARNING", "Groq API key is missing. Falling back to basic parsing.");
      return basicParse(transcript);
    }

    // Calculate current date information
    const now = new Date();
    const isoDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
    const fullDateTime = now.toISOString();
    
    debugLog("DATE CALCULATION", {
      now: now.toString(),
      isoDate,
      weekday,
      fullDateTime,
      dayOfWeek: now.getDay(),
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    });
    
    // Provide clear reference date with multiple formats
    const referenceDate = `Today is ${weekday}, ${isoDate} (Full timestamp: ${fullDateTime})`;
    
    // Calculate next occurrence of each day of the week
    const currentDay = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const daysOfWeek = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6
    };
    
    const calculateNextDay = (targetDay) => {
      const date = new Date(now);
      let daysUntil;
      if (currentDay < targetDay) {
        daysUntil = targetDay - currentDay;
      } else {
        daysUntil = 7 - currentDay + targetDay;
      }
      date.setDate(now.getDate() + daysUntil);
      return date.toISOString().split('T')[0];
    };
    
    const nextMonday = calculateNextDay(daysOfWeek.monday);
    const nextTuesday = calculateNextDay(daysOfWeek.tuesday);
    const nextWednesday = calculateNextDay(daysOfWeek.wednesday);
    const nextThursday = calculateNextDay(daysOfWeek.thursday);
    const nextFriday = calculateNextDay(daysOfWeek.friday);
    const nextSaturday = calculateNextDay(daysOfWeek.saturday);
    const nextSunday = calculateNextDay(daysOfWeek.sunday);
    
    debugLog("NEXT DAY CALCULATIONS", {
      currentDay: `${currentDay} (${weekday})`,
      nextMonday,
      nextTuesday,
      nextWednesday,
      nextThursday,
      nextFriday,
      nextSaturday,
      nextSunday,
      tomorrow: new Date(now.getTime() + 86400000).toISOString().split('T')[0]
    });
    
    const prompt = `
You are a **Task‑Extraction Assistant**.  
From a raw voice‑to‑text transcript, produce a single JSON object that describes the task.

**Input**
----  
TRANSCRIPT:
"""${transcript}"""

**CURRENT DATE & TIME (CRITICAL - USE THIS AS YOUR REFERENCE):**
${referenceDate}

For example:
- "today" means ${isoDate}
- "tomorrow" means ${new Date(now.getTime() + 86400000).toISOString().split('T')[0]}
- "next Monday" means ${nextMonday}
- "next Tuesday" means ${nextTuesday}
- "next Wednesday" means ${nextWednesday}
- "next Thursday" means ${nextThursday}
- "next Friday" means ${nextFriday}
- "next Saturday" means ${nextSaturday}
- "next Sunday" means ${nextSunday}

----
**Output format (exactly, no extra text)**
{
  "title": "<concise‑task‑summary>",
  "priority": "High|Medium|Low",
  "dueDate": "<ISO‑8601 datetime or null>",
  "status": "To Do|In Progress|Done"
}
----
**Guidelines**

1. **Title**
   * Summarize the core action only.
   * Strip filler ("remind me to", "please", "can you", "I need to", etc.).
   * Do **not** embed dates, times, or priority words.

2. **Priority**
   * **High** – words: urgent, asap, important, high priority, critical.
   * **Low** – words: low priority, optional, whenever, eventually.
   * Default → **Medium**.

3. **Due Date - CRITICAL INSTRUCTIONS**
   * **ALWAYS calculate dates from the reference date provided above: ${isoDate}**
   * Recognise relative dates (tomorrow, next Wednesday, in 2 days, this Friday, next week, etc.)
   * Recognise absolute dates (e.g., "January 15", "20 December")
   * **If a time is mentioned, keep it exactly as stated**
   * **If NO time is mentioned, YOU MUST SET THE TIME TO 23:59:59** (NOT 00:00:00)
   * Return the full ISO‑8601 timestamp (e.g., '2025-12-12T23:59:59')
   * If no date/time can be inferred → null
   * **VERIFY YOUR DATE MATH**: Count the days forward from ${isoDate}

4. **Status**
   * Default → **To Do**
   * Change only when the speaker explicitly says "mark as done", "completed", "finished", "start working on", "in progress", etc.

**Extra rules**
* Correct obvious speech‑to‑text errors (e.g., "tomorow" → "tomorrow", "febuary" → "February")
* All dates are calculated **forward** from ${isoDate}
* Output **only** the JSON object – no explanations, no markdown code blocks

**Few‑shot examples**
---
Example 1 (if today is 2025-12-06, Saturday)
TRANSCRIPT: "Remind me to call Dr. Smith next Tuesday at 10 am, it's urgent."
Output:
{
  "title": "Call Dr. Smith",
  "priority": "High",
  "dueDate": "2025-12-09T10:00:00",
  "status": "To Do"
}

Example 2 (if today is 2025-12-06, Saturday)
TRANSCRIPT: "Can you add 'buy groceries' to my list? No rush, maybe this weekend."
Output:
{
  "title": "Buy groceries",
  "priority": "Low",
  "dueDate": "2025-12-07T23:59:59",
  "status": "To Do"
}

Example 3
TRANSCRIPT: "Mark the budget review as done, it was done yesterday."
Output:
{
  "title": "Budget review",
  "priority": "Medium",
  "dueDate": null,
  "status": "Done"
}
---

**NOW PROCESS THE TRANSCRIPT ABOVE AND RETURN ONLY THE JSON OBJECT.**
    `;

    debugLog("PROMPT SENT TO GROQ", { 
      promptLength: prompt.length,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    
    debugLog("RAW GROQ RESPONSE", {
      hasContent: !!content,
      contentLength: content?.length || 0,
      rawContent: content
    });
    
    if (!content) throw new Error("No content received from Groq");

    // Extract JSON
    const parsedData = extractJSON(content);
    
    debugLog("EXTRACTED JSON", parsedData);

    const fallbackTitle =
      transcript.length > 50 ? transcript.substring(0, 50) + "..." : transcript;

    const finalResult = {
      title: parsedData.title || fallbackTitle,
      description: transcript,
      priority: parsedData.priority || "Medium",
      status: parsedData.status || "To Do",
      dueDate: parsedData.dueDate || null,
      transcript
    };
    
    debugLog("FINAL RESULT", finalResult);
    
    return finalResult;
    
  } catch (error) {
    debugLog("ERROR IN AI PARSING", {
      errorMessage: error.message,
      errorStack: error.stack,
      fallingBackToBasicParse: true
    });
    
    return basicParse(transcript);
  }
}
function extractJSON(text) {
  debugLog("JSON EXTRACTION - INPUT", { text });
  
  try {
   
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    
    debugLog("JSON EXTRACTION - CLEANED", { cleaned });

    try {
      const directParse = JSON.parse(cleaned);
      debugLog("JSON EXTRACTION - SUCCESS (Direct Parse)", directParse);
      return directParse;
    } catch (e) {
      debugLog("JSON EXTRACTION - Direct parse failed, trying regex", { error: e.message });
    }
    const match = cleaned.match(/\{[\s\S]*?\}/);
    if (match) {
      const regexParse = JSON.parse(match[0]);
      debugLog("JSON EXTRACTION - SUCCESS (Regex Parse)", { 
        matched: match[0],
        parsed: regexParse
      });
      return regexParse;
    }

    throw new Error("No JSON found in output");
  } catch (err) {
    debugLog("JSON EXTRACTION - FAILED", {
      error: err.message,
      stack: err.stack,
      returningEmptyObject: true
    });
    return {}; // fail gracefully, trigger fallback defaults
  }
}

function basicParse(transcript) {
  debugLog("BASIC PARSE - STARTING", { transcript });
  
  const lower = transcript.toLowerCase();
  
  let priority = "Medium";
  if (lower.includes("urgent") || lower.includes("high")) priority = "High";
  if (lower.includes("low")) priority = "Low";
  
  debugLog("BASIC PARSE - Priority", { priority, keywords: { urgent: lower.includes("urgent"), high: lower.includes("high"), low: lower.includes("low") } });

  let status = "To Do";
  if (lower.includes("in progress")) status = "In Progress";
  if (lower.includes("done")) status = "Done";
  
  debugLog("BASIC PARSE - Status", { status, keywords: { inProgress: lower.includes("in progress"), done: lower.includes("done") } });

  let dueDate = null;
  const today = new Date();
  const currentDay = today.getDay();
  
  debugLog("BASIC PARSE - Date Info", {
    today: today.toISOString(),
    currentDay,
    currentDayName: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay]
  });

  // Helper function to calculate next occurrence of a day
  const calculateNextDay = (targetDay) => {
    const result = new Date(today);
    let daysUntil;
    if (currentDay < targetDay) {
      daysUntil = targetDay - currentDay;
    } else {
      daysUntil = 7 - currentDay + targetDay;
    }
    result.setDate(today.getDate() + daysUntil);
    
    debugLog("BASIC PARSE - calculateNextDay", {
      targetDay,
      currentDay,
      daysUntil,
      resultDate: result.toISOString().split("T")[0]
    });
    
    return result.toISOString().split("T")[0];
  };

  // Check for specific days of the week
  const dayChecks = {
    monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
    friday: 5, saturday: 6, sunday: 0
  };
  
  for (const [dayName, dayNum] of Object.entries(dayChecks)) {
    if (lower.includes(dayName)) {
      dueDate = calculateNextDay(dayNum);
      debugLog("BASIC PARSE - Day Detected", { dayName, dayNum, dueDate });
      break;
    }
  }
  
  if (!dueDate) {
    if (lower.includes("tomorrow")) {
      today.setDate(today.getDate() + 1);
      dueDate = today.toISOString().split("T")[0];
      debugLog("BASIC PARSE - Tomorrow Detected", { dueDate });
    } else if (lower.includes("next week")) {
      today.setDate(today.getDate() + 7);
      dueDate = today.toISOString().split("T")[0];
      debugLog("BASIC PARSE - Next Week Detected", { dueDate });
    }
  }

  // Time detection
  const timeMatch = lower.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm|p\.m\.|a\.m\.)?/i);
  
  debugLog("BASIC PARSE - Time Match", { 
    found: !!timeMatch, 
    match: timeMatch ? timeMatch[0] : null,
    groups: timeMatch ? { hours: timeMatch[1], minutes: timeMatch[2], modifier: timeMatch[3] } : null
  });

  if (dueDate && timeMatch) {
    let [_, hours, minutes, modifier] = timeMatch;
    hours = parseInt(hours);
    minutes = minutes ? parseInt(minutes) : 0;

    if (modifier) {
      modifier = modifier.toLowerCase().replace(/\./g, "");
      if (modifier === "pm" && hours < 12) hours += 12;
      if (modifier === "am" && hours === 12) hours = 0;
    }

    dueDate = `${dueDate}T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
      
    debugLog("BASIC PARSE - Time Added", { hours, minutes, modifier, dueDate });
  } else if (dueDate) {
    dueDate = `${dueDate}T23:59:59`;
    debugLog("BASIC PARSE - Default Time Added", { dueDate });
  }

  const title = transcript.split(" ").slice(0, 6).join(" ") + "...";

  const result = {
    title,
    description: transcript,
    priority,
    status,
    dueDate,
    transcript
  };
  
  debugLog("BASIC PARSE - FINAL RESULT", result);

  return result;
}