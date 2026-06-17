/**
 * Simple natural language parser for local task creation and commands.
 * Assists in parsing actions such as adding tasks, suggesting checklists, and summarizing stats.
 */

// Common task breakdowns for offline/mock mode
const MOCK_BREAKDOWNS = {
  website: [
    "Design wireframes and layout UI",
    "Set up React project and styling structure",
    "Create component structures and state logic",
    "Connect API integrations and state persistence",
    "Test responsive layouts and deploy application"
  ],
  study: [
    "Review lecture slides and highlights",
    "Write down key summary notes",
    "Solve practice questions or flashcards",
    "Take a short study break (Pomodoro)",
    "Do a quick self-test or quiz"
  ],
  project: [
    "Define project scope and requirements",
    "Create architectural design or flowcharts",
    "Implement base codebase foundation",
    "Develop core functionality modules",
    "Refactor code and execute testing cycles"
  ],
  shopping: [
    "List down essential grocery items",
    "Check pantry for existing stocks",
    "Compare deals and select a store",
    "Purchase items and double check list"
  ],
  presentation: [
    "Outline the core message and slide deck flow",
    "Draft the content for individual slides",
    "Incorporate clean visual graphics and diagrams",
    "Rehearse verbal delivery and time constraints",
    "Verify compatibility with projection system"
  ],
  workout: [
    "10 minutes dynamic stretching warm-up",
    "Main resistance training or cardio set",
    "Core strength exercises",
    "Cool down stretching and rehydration"
  ],
  clean: [
    "De-clutter surfaces and organize papers",
    "Dust furniture and appliances",
    "Sweep and mop the flooring",
    "Empty trash bins and replace liners"
  ]
};

export function parseLocalCommand(text, todos = []) {
  const query = text.toLowerCase().trim();
  
  // 1. Check for Task Creation Command
  // e.g., "add task Buy groceries tomorrow high priority work"
  const addKeywords = ["add", "create", "todo", "remind me to", "new task", "make a task"];
  const isAddCommand = addKeywords.some(keyword => query.startsWith(keyword) || query.includes("create a task") || query.includes("add task"));
  
  if (isAddCommand) {
    // Clean up command prefix
    let titleQuery = text;
    addKeywords.forEach(keyword => {
      const regex = new RegExp(`^${keyword}\\s+(task\\s+)?`, "i");
      titleQuery = titleQuery.replace(regex, "");
    });
    // Remove other phrases like "create a task to", "add task to", "remind me to"
    titleQuery = titleQuery.replace(/^(create a task to|add task to|remind me to|todo|new task)\s+/gi, "");

    // Extract Priority
    let priority = "medium";
    if (/\b(high|urgent|critical|important)\b/i.test(query)) {
      priority = "high";
    } else if (/\b(low|easy|trivial|minor)\b/i.test(query)) {
      priority = "low";
    }

    // Extract Category
    let category = "Personal";
    if (/\b(work|office|job|meeting|client)\b/i.test(query)) {
      category = "Work";
    } else if (/\b(study|learn|exam|course|college|school|read|assignment)\b/i.test(query)) {
      category = "Study";
    } else if (/\b(shop|buy|grocery|groceries|mall|store)\b/i.test(query)) {
      category = "Shopping";
    } else if (/\b(health|workout|gym|run|fitness|doctor|meds)\b/i.test(query)) {
      category = "Health";
    } else if (/\b(finance|pay|bill|rent|money|bank)\b/i.test(query)) {
      category = "Finance";
    }

    // Clean priority and category indicators from the title
    let title = titleQuery
      .replace(/\b(high|medium|low|urgent|critical|important|easy|trivial|minor)\s+priority\b/gi, "")
      .replace(/\b(priority)\s+(high|medium|low|urgent|critical|important|easy|trivial|minor)\b/gi, "")
      .replace(/\b(high|medium|low|urgent|critical|important|easy|trivial|minor)\b/gi, "")
      .replace(new RegExp(`\\b(in|category|tag|for)?\\s*(work|personal|study|shopping|health|finance)\\b`, "gi"), "")
      .trim();

    // Extract Due Date (simple parsing)
    let dueDate = "";
    const today = new Date();
    
    if (/\btoday\b/i.test(query)) {
      dueDate = today.toISOString().split("T")[0];
      title = title.replace(/\btoday\b/gi, "").trim();
    } else if (/\btomorrow\b/i.test(query)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      dueDate = tomorrow.toISOString().split("T")[0];
      title = title.replace(/\btomorrow\b/gi, "").trim();
    } else if (/\bnext week\b/i.test(query)) {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      dueDate = nextWeek.toISOString().split("T")[0];
      title = title.replace(/\bnext week\b/gi, "").trim();
    } else {
      // Look for day of week (e.g. "on monday", "by friday")
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      for (let i = 0; i < 7; i++) {
        const dayRegex = new RegExp(`\\b(on|by|this)?\\s*${days[i]}\\b`, "i");
        if (dayRegex.test(query)) {
          const targetDay = i;
          const currentDay = today.getDay();
          let daysToAdd = targetDay - currentDay;
          if (daysToAdd <= 0) daysToAdd += 7; // Next week's day
          
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + daysToAdd);
          dueDate = targetDate.toISOString().split("T")[0];
          title = title.replace(dayRegex, "").trim();
          break;
        }
      }
    }

    // Clean up extra spaces and prepositions at the end
    title = title.replace(/\b(at|on|by|in|for|to)$/gi, "").trim();
    if (!title) title = "New AI Generated Task";

    // Format display string
    const dateStr = dueDate ? ` for **${dueDate}**` : " with no due date";
    const responseText = `I have drafted a task for you:\n\n📝 **Title:** ${title}\n🔥 **Priority:** ${priority.toUpperCase()}\n📂 **Category:** ${category}\n📅 **Due:** ${dateStr}\n\nWould you like me to add this to your list?`;

    return {
      action: "add",
      data: { title, priority, category, dueDate, subtasks: [] },
      response: responseText,
      suggestions: ["Confirm Task Creation", "Cancel"]
    };
  }

  // 2. Check for task breakdowns
  // e.g. "break down study React", "subtasks for build landing page"
  const breakdownKeywords = ["break down", "subtask", "checklist", "steps for", "divide", "breakdown"];
  const isBreakdownCommand = breakdownKeywords.some(kw => query.includes(kw));

  if (isBreakdownCommand) {
    let subject = text;
    breakdownKeywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\s*(for|of|to)?\\s*`, "gi");
      subject = subject.replace(regex, "");
    });
    subject = subject.trim();
    if (!subject) subject = "your task";

    // Try to find matching mock breakdown keys
    let checklist = [];
    const keys = Object.keys(MOCK_BREAKDOWNS);
    const matchedKey = keys.find(k => subject.toLowerCase().includes(k));

    if (matchedKey) {
      checklist = MOCK_BREAKDOWNS[matchedKey];
    } else {
      // Default general checklist
      checklist = [
        `Plan the scope for: ${subject}`,
        "Gather necessary resources and tools",
        "Implement the initial design or draft",
        "Refine and complete the main requirements",
        "Review and polish the finalized work"
      ];
    }

    const responseText = `Here is a step-by-step checklist breakdown for **"${subject}"**:\n\n` + 
      checklist.map((item, idx) => `${idx + 1}. ⬜ ${item}`).join("\n") +
      `\n\nWould you like to create this task with these subtasks loaded?`;

    return {
      action: "breakdown",
      data: {
        title: subject,
        priority: "medium",
        category: "Work",
        dueDate: new Date().toISOString().split("T")[0],
        subtasks: checklist.map(title => ({ id: Math.random().toString(36).substr(2, 9), title, completed: false }))
      },
      response: responseText,
      suggestions: ["Create Task with Checklist", "No thanks"]
    };
  }

  // 3. Check for analysis/productivity status
  // e.g. "progress", "stats", "productivity", "how am i doing"
  if (/\b(progress|stats|productivity|analyze|summary|how am i doing)\b/i.test(query)) {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    let advice = "No tasks yet! Add some tasks to begin tracking your productivity.";
    if (total > 0) {
      if (completionRate === 100) {
        advice = "Incredible job! You've checked off every single task. You are in deep focus flow! 🚀";
      } else if (completionRate >= 75) {
        advice = "You're doing fantastic! Almost done with your list. Keep pushing to cross the finish line! 💪";
      } else if (completionRate >= 40) {
        advice = "You are making steady progress. Focus on your High Priority items first to maximize efficiency. 🎯";
      } else {
        advice = "You've got some work ahead of you. Try breaking down larger tasks into smaller subtasks to get momentum going! ⚡";
      }
    }

    const responseText = `📊 **Productivity Report:**\n\n` +
      `* **Total Tasks:** ${total}\n` +
      `* **Completed:** ${completed} (✅ ${completionRate}%)\n` +
      `* **Pending:** ${pending} (⏳)\n\n` +
      `💡 **Zenith AI Counsel:** ${advice}`;

    return {
      action: "analyze",
      response: responseText,
      suggestions: ["View Dashboard", "Close Chat"]
    };
  }

  // 4. Default Chat response
  const greetings = ["hi", "hello", "hey", "aoa", "assalam", "yo", "greetings"];
  const isGreeting = greetings.some(g => query.startsWith(g));
  
  let responseText = "I didn't quite catch that action command. You can ask me to:\n\n" +
    "1. **Create tasks:** *\"Add task Design Landing Page by tomorrow High priority\"*\n" +
    "2. **Break down tasks:** *\"Break down study React\"*\n" +
    "3. **Check stats:** *\"Analyze my progress\"*\n\n" +
    "How can I help you today?";

  if (isGreeting) {
    responseText = "Hello! I am **Zenith AI**, your intelligent todo partner. 🤖⚡\n\n" +
      "I can create tasks, generate checklists, or analyze your daily productivity. Just tell me what you want to achieve!\n\n" +
      "For example, try typing:\n*\"Add task Prepare slides by tomorrow high priority\"* or *\"Break down learning Python\"*";
  }

  return {
    action: "chat",
    response: responseText,
    suggestions: ["Add task...", "Break down...", "Show stats"]
  };
}

export async function askGemini(prompt, systemPrompt, apiKey, todos = []) {
  if (!apiKey) {
    return parseLocalCommand(prompt, todos);
  }

  try {
    const formattedTodos = todos.map(t => ({
      title: t.title,
      category: t.category,
      priority: t.priority,
      completed: t.completed,
      dueDate: t.dueDate,
      subtasks: t.subtasks?.map(s => s.title) || []
    }));

    const fullSystemPrompt = `${systemPrompt}\n\nCURRENT USER TODOS:\n${JSON.stringify(formattedTodos)}\n\n` +
      `You can generate JSON payload replies to command actions. If the user wants to add a task or break one down, return a JSON block at the very end of your response starting with 'ACTION_JSON:' followed by a JSON object: \n` +
      `{"action": "add"|"breakdown", "task": {"title": "title", "priority": "high"|"medium"|"low", "category": "Work"|"Personal"|"Study"|"Shopping"|"Health"|"Finance", "dueDate": "YYYY-MM-DD", "subtasks": ["step 1", "step 2"]}}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${fullSystemPrompt}\n\nUser Message: ${prompt}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    const result = await response.json();
    const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error("Empty response from Gemini API");
    }

    // Check if Gemini attached an action block
    const actionMatch = replyText.match(/ACTION_JSON:\s*(\{.*\})/s);
    if (actionMatch) {
      try {
        const actionData = JSON.parse(actionMatch[1]);
        const cleanedReply = replyText.replace(/ACTION_JSON:\s*\{.*\}/s, "").trim();
        
        if (actionData.action === "add" || actionData.action === "breakdown") {
          const t = actionData.task;
          const formattedSubtasks = t.subtasks?.map(st => ({
            id: Math.random().toString(36).substr(2, 9),
            title: typeof st === 'string' ? st : st.title,
            completed: false
          })) || [];

          return {
            action: actionData.action,
            data: {
              title: t.title || "AI Task",
              priority: t.priority || "medium",
              category: t.category || "Work",
              dueDate: t.dueDate || new Date().toISOString().split("T")[0],
              subtasks: formattedSubtasks
            },
            response: cleanedReply,
            suggestions: ["Confirm Task", "Cancel"]
          };
        }
      } catch (e) {
        console.error("Failed to parse Gemini Action JSON", e);
      }
    }

    return {
      action: "chat",
      response: replyText,
      suggestions: ["Add task", "Break down task", "Analyze productivity"]
    };

  } catch (error) {
    console.error("Gemini API Error", error);
    return {
      action: "chat",
      response: `⚠️ **Gemini API Error:** ${error.message}\n\nFalling back to local AI parsing:\n\n` + parseLocalCommand(prompt, todos).response,
      suggestions: ["Try local commands"]
    };
  }
}
