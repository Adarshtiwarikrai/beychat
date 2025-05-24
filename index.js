
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Langchain imports
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

dotenv.config();


const DEFAULT_PORT = 3001;
const MAX_TEXT_LENGTH = 5000; 

const app = express();
const port = process.env.PORT || DEFAULT_PORT;


const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" })); 

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize LLM
let llm;
let llmInitialized = false;

const initializeLLM = () => {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("FATAL ERROR: GOOGLE_API_KEY is not defined");
    return false;
  }

  try {
    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-pro",
      temperature: 1,
    });
    console.log("LLM initialized successfully");
    llmInitialized = true;
    return true;
  } catch (e) {
    console.error("LLM initialization failed:", e.message);
    return false;
  }
};

llmInitialized = initializeLLM();

// Initialize chat chain
let chainWithHistory;
const messageHistories = {};

if (llmInitialized) {
  const assistantChatPrompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      `You are a helpful AI assistant for a customer support dashboard.
      Follow these rules:
      1. Be concise and professional
      2. Only answer support-related queries
      3. Base responses on conversation context when available`
    ),
    new MessagesPlaceholder("history"),
    new HumanMessage("{input}"),
  ]);

  chainWithHistory = new RunnableWithMessageHistory({
    runnable: assistantChatPrompt.pipe(llm),
    getMessageHistory: async (sessionId) => {
      if (!messageHistories[sessionId]) {
        messageHistories[sessionId] = new InMemoryChatMessageHistory();
      }
      return messageHistories[sessionId];
    },
    inputMessagesKey: "input",
    historyMessagesKey: "history",
  });
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    llmInitialized,
    timestamp: new Date().toISOString(),
  });
});

// AI Chat Endpoint (Streaming)
app.get("/api/ai/chat", async (req, res) => {
  if (!llmInitialized) {
    return sendErrorResponse(res, 503, "AI service unavailable");
  }

  const { message, sessionId, chatContext } = req.query;

  if (!message || !sessionId) {
    return sendErrorResponse(
      res,
      400,
      "Missing required parameters: message and sessionId"
    );
  }

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const context = chatContext || "No specific context provided";
    const stream = await chainWithHistory.stream(
      {
        input: message,
        conversation_context_summary: context,
      },
      { configurable: { sessionId } }
    );

    let fullResponse = "";
    for await (const chunk of stream) {
      if (chunk?.content) {
        const content = chunk.content.toString();
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }

    res.write(
      `data: ${JSON.stringify({ endOfStream: true, fullResponse })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("Chat streaming error:", error);
    if (!res.headersSent) {
      sendErrorResponse(res, 500, "Error during chat streaming");
    } else {
      try {
        res.write(
          `data: ${JSON.stringify({
            error: "Streaming error",
            message: error.message,
            endOfStream: true,
          })}\n\n`
        );
        res.end();
      } catch (e) {
        console.error("Failed to send error to client:", e);
      }
    }
  }
});

// Text Transformation Endpoint
app.post("/api/ai/transform-text", async (req, res) => {
  console.log("Transform text endpoint called");
  if (!llmInitialized) {
    return sendErrorResponse(res, 503, "AI service unavailable");
  }

  // Validate request
  if (!req.body || typeof req.body !== "object") {
    return sendErrorResponse(res, 400, "Invalid request format");
  }

  const { action, text } = req.body;
  console.log("Action:", action, "Text:", text);
  
  if (!action || typeof text !== "string") {
    return sendErrorResponse(
      res,
      400,
      "Missing required fields: action and text"
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return sendErrorResponse(
      res,
      400,
      `Text too long (max ${MAX_TEXT_LENGTH} characters)`
    );
  }

  // Define transformations with specific, focused prompts
  const transformations = {
    rephrase: `Rephrase the following text using different words while keeping the EXACT same meaning and tone. Do not change the formality level, style, or intent. Simply express the same idea with alternative wording. If the text is already clear and well-written, make minimal changes. Output only the rephrased text with no explanations.`,
    
    tone_of_voice: `Adjust ONLY the tone of the following text to be professional and suitable for business communication. Keep the same message, facts, and structure. Do not add or remove information. Only modify word choices and phrasing to sound more professional. Output only the tone-adjusted text.`,
    
    more_friendly: `Make the following text sound more friendly and warm while keeping it professional. Add friendly language, soften harsh words, and make it more approachable. Do not change the core message or remove important information. Output only the friendlier version.`,
    
    more_formal: `Make the following text more formal and business-appropriate. Use professional language, remove casual expressions, and ensure proper business etiquette. Keep the same message and information. Do not make it overly complex. Output only the formal version.`,
    
    fix_grammar: `You are a meticulous proofreading AI. Your sole task is to correct grammar and spelling errors in the text provided by the user.
    Follow these instructions precisely:
    1.  Identify and correct ONLY grammatical errors and spelling mistakes.
    2.  Do NOT rephrase sentences or change the original wording unless it's to fix an error.
    3.  Do NOT alter the meaning, style, or tone of the text.
    4.  Make the absolute minimum number of changes necessary.
    5.  If the provided text contains no errors, return the original text verbatim.
    6.  Your entire response MUST consist of ONLY the corrected text. Do not include any other words, preambles, explanations, apologies, or any form of meta-commentary (e.g., do not say "Here is the corrected text:"). Do not use placeholders like '{correctedText}'.

    Example 1:
    User text: "he go to store yestaday and buyed bred"
    Your corrected output: He went to the store yesterday and bought bread.

    Example 2:
    User text: "This sentence is perfectly fine."
    Your corrected output: This sentence is perfectly fine.

    Example 3:
    User text: "its a cool day isnt it"
    Your corrected output: It's a cool day, isn't it?

    The user will now provide the text. Your output must be only the corrected version of that text.`, 
    translate: `Translate the following text accurately to Spanish. Maintain the same tone, formality level, and meaning. Use appropriate Spanish grammar and natural phrasing. Do not add explanations or notes. Output only the Spanish translation. The user will now provide the text.`,
  };

  if (!transformations[action]) {
    return sendErrorResponse(res, 400, `Invalid action: ${action}`);
  }

  try {
   
    let chainToUse;
    let taskTemperature;
    
   
    switch(action) {
      case 'fix_grammar':
        taskTemperature = 0.05;
        break;
      case 'translate':
        taskTemperature = 0.1; 
        break;
      case 'more_formal':
      case 'tone_of_voice':
        taskTemperature = 0.2;
        break;
      case 'rephrase':
      case 'more_friendly':
        taskTemperature = 0.3; 
        break;
      default:
        taskTemperature = 0.3;
    }
    
    // Create LLM with appropriate temperature
    const taskLLM = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-1.5-pro-latest",
      temperature: taskTemperature,
    });
    
    const transformPrompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(transformations[action]),
      new HumanMessage("{inputText}"), 
    ]);
    
    chainToUse = transformPrompt.pipe(taskLLM);

    const result = await chainToUse.invoke({ inputText: text });
    console.log(`Raw LLM output for action "${action}" on input "${text}":\nContent: ${JSON.stringify(result?.content)}`);
    
    if (!result?.content || typeof result.content !== 'string' || result.content.trim() === "") {
      console.error(`AI returned empty or invalid content for ${action}. Input: "${text}"`);
   
      if (action === 'fix_grammar') {
        return res.json({
            transformedText: text, 
            action: action,
            originalLength: text.length,
            transformedLength: text.length,
            note: "AI returned empty/invalid response, original text used."
        });
      }
     
      throw new Error(`AI returned empty or invalid content for ${action}`);
    }

    let transformedText = result.content.toString().trim();
    
   
    switch(action) {
      case 'fix_grammar':
        const refusalPatterns = /^{.*}$|cannot fulfill|unable to process|as an ai language model|i am not able to|i cannot provide|not possible to|sorry, but|i'm just a language model|here is the corrected text:/i;
        const instructionEchoPatterns = /output only the corrected text|your corrected output:|the user will now provide|user text:/i; // Added more patterns

        
        const commonMisspellings = /\b(gooda|teh|yestaday|buyed|isnt|walked|dont|doesnt|youre|theyre|theres)\b/i;
        const hasObviousErrors = commonMisspellings.test(text.toLowerCase());

        if (refusalPatterns.test(transformedText.toLowerCase()) || 
            instructionEchoPatterns.test(transformedText.toLowerCase()) ||
            (transformedText.length < 2 && text.length >= 2) || // Very short, likely erroneous output
            (transformedText.toLowerCase().trim() === text.toLowerCase().trim() && hasObviousErrors) // If text is unchanged but had obvious errors
           ) {
          console.warn(`Grammar fix returned problematic output for input "${text}". LLM Output: '${transformedText}'. Returning original text.`);
          transformedText = text; // Fallback to original text
        } else if (text.toLowerCase().trim() !== transformedText.toLowerCase().trim() && (transformedText.length > text.length * 2.5 || transformedText.length < text.length * 0.2)) {
          
          const originalWords = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
          const transformedWords = transformedText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
          const commonWords = originalWords.filter(word => transformedWords.includes(word));
          
          if (originalWords.length > 3 && commonWords.length < originalWords.length * 0.3) { // If less than 30% of original words (longer than 2 chars) are present
            console.warn(`Grammar fix significantly changed text content AND length for input "${text}". LLM Output: '${transformedText}'. Word overlap too low. Returning original text.`);
            transformedText = text;
          }
        }
        break;
        
      case 'translate':
       
        if (transformedText.toLowerCase() === text.toLowerCase() && text.length > 5) { 
          console.warn('Translation may have failed - text unchanged for input:', text);
         
        }
        break;
        
      case 'rephrase':
       
        if (transformedText.toLowerCase() === text.toLowerCase() && text.length > 10) {
          console.warn(`Rephrasing attempt for "${text}" resulted in identical text. Attempting a more direct retry.`);
          const retrySystemMessage = `The user wants this text rephrased using different words: "${text}". You MUST use different vocabulary while keeping the exact same meaning and tone. It is essential that your output is different from the original text. Output only the rephrased text, with no explanations or preamble. The user will now provide the text.`;
          const retryPrompt = ChatPromptTemplate.fromMessages([
            new SystemMessage(retrySystemMessage),
            new HumanMessage("{inputText}"),
          ]);
         
          const retryLLM = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "gemini-1.5-pro-latest",
            temperature: Math.min(taskTemperature + 0.15, 0.7), 
          });
          const retryChain = retryPrompt.pipe(retryLLM); 
          const retryResult = await retryChain.invoke({ inputText: text }); 

          if (retryResult?.content) {
            const retryTransformedText = retryResult.content.toString().trim();
            if (retryTransformedText.toLowerCase() !== text.toLowerCase() && retryTransformedText.length > 0) {
                transformedText = retryTransformedText;
                console.log('Rephrasing retry successful.');
            } else {
                console.warn('Rephrasing retry also resulted in identical or empty text. Original text will be used.');
            }
          } else {
            console.warn('Rephrasing retry resulted in empty content.');
          }
        }
        break;
    }
    
    res.json({ 
      transformedText,
      action: action,
      originalLength: text.length,
      transformedLength: transformedText.length
    });
    
  } catch (error) {
    console.error(`${action} transformation error:`, error);
    
   
    let errorMessage;
    switch(action) {
      case 'fix_grammar':
        errorMessage = "Error fixing grammar and spelling";
        break;
      case 'translate':
        errorMessage = "Error translating text to Spanish";
        break;
      case 'rephrase':
        errorMessage = "Error rephrasing text";
        break;
      case 'tone_of_voice':
        errorMessage = "Error adjusting tone to professional";
        break;
      case 'more_friendly':
        errorMessage = "Error making text more friendly";
        break;
      case 'more_formal':
        errorMessage = "Error making text more formal";
        break;
      default:
        errorMessage = `Error during ${action} transformation`;
    }
    
    sendErrorResponse(
      res,
      500,
      errorMessage,
      process.env.NODE_ENV === "development" ? error.message : null
    );
  }
});


function sendErrorResponse(res, status, message, details = null) {
  const response = {
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };
  return res.status(status).json(response);
}


app.use((req, res) => {
  sendErrorResponse(res, 404, "Endpoint not found");
});


app.use((err, req, res, next) => {
  console.error("Global error:", err);
  sendErrorResponse(
    res,
    500,
    "Internal server error",
    process.env.NODE_ENV === "development" ? err.stack : null
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`LLM initialized: ${llmInitialized}`);
  if (!llmInitialized) {
    console.warn("Warning: AI functionality will be limited");
  }
});