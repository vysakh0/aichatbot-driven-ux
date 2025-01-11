import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// These are just function definitions for OpenAI, not actual implementations
const functions = [
  {
    name: "addTodo",
    description: "Add a new todo item to the list",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text content of the todo item",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "removeTodo",
    description: "Remove a todo item from the list by its ID",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The ID of the todo item to remove",
        },
      },
      required: ["id"],
    },
  },
];

export async function POST(request: Request) {
  try {
    const { message, todos } = await request.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant managing a todo list. Current todos: ${
            todos.length > 0
              ? todos.map((t: any) => `"${t.text}" (ID: ${t.id})`).join(", ")
              : "no todos yet"
          }`,
        },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo",
      functions,
      function_call: "auto",
    });

    const responseMessage = completion.choices[0].message;

    // If the model wants to call a function, return the function call details
    if (responseMessage.function_call) {
      const { name, arguments: args } = responseMessage.function_call;
      return NextResponse.json({
        functionCall: {
          name,
          args: JSON.parse(args),
        },
      });
    }

    // Otherwise return the normal reply
    return NextResponse.json({ reply: responseMessage.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
