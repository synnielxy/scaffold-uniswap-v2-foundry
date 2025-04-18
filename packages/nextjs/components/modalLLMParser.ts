import OpenAI from "openai";

// Define the model name and API configuration
const MODEL_NAME = "neuralmagic/Meta-Llama-3.1-8B-Instruct-quantized.w4a16";
const API_KEY = "neu-3e21der1trt341!f";
const BASE_URL = "https://neu-info5100-oak-spr-2025--example-vllm-openai-compatible-serve.modal.run/v1";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
  dangerouslyAllowBrowser: true,
});

// Define the response type
interface SwapResponse {
  function: string;
  arguments: {
    amountIn: string;
    tokenIn: string;
    tokenOut: string;
  };
}

export const parseWithModalLLM = async (inputText: string): Promise<SwapResponse | null> => {
  try {
    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that converts natural language instructions about Uniswap V2 operations into structured function calls.
          For swap operations, convert them into the following format:
          {
            "function": "swap_exact_tokens_for_tokens",
            "arguments": {
              "amountIn": <number>,
              "tokenIn": "<token symbol>",
              "tokenOut": "<token symbol>"
            }
          }
          
          Only respond with the JSON object, no additional text or explanation.`,
        },
        {
          role: "user",
          content: inputText,
        },
      ],
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      console.error("No response from LLM");
      return null;
    }

    try {
      // Remove markdown code block formatting if present
      let cleanedResponse = response;
      if (response.startsWith("```json")) {
        cleanedResponse = response.slice(7); // Remove ```json
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3); // Remove ```
      }
      cleanedResponse = cleanedResponse.trim();

      // Parse the response as JSON
      const result = JSON.parse(cleanedResponse) as SwapResponse;
      return result;
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      return null;
    }
  } catch (error) {
    console.error("Error calling Modal LLM:", error);
    return null;
  }
};
