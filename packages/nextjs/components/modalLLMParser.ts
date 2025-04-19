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
interface OperationResponse {
  function: string;
  arguments: {
    amountIn?: string;
    tokenIn?: string;
    tokenOut?: string;
    tokenA?: string;
    tokenB?: string;
    amountADesired?: string;
    amountBDesired?: string;
  };
}

// Define the data analysis response type
interface DataAnalysisResponse {
  type: "reserves" | "swaps" | "price" | "price_history" | "liquidity" | "volume" | "price_impact";
  pool: string;
  timeframe?: string;
  token0?: string;
  token1?: string;
  period?: "hour" | "day" | "week" | "month";
}

export const parseWithModalLLM = async (
  inputText: string,
): Promise<OperationResponse | DataAnalysisResponse | null> => {
  try {
    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that converts natural language instructions about Uniswap V2 operations into structured function calls or data analysis requests.

          For swap operations, convert them into the following format:
          {
            "function": "swapExactTokensForTokens",
            "arguments": {
              "amountIn": <number>,
              "tokenIn": "<token symbol>",
              "tokenOut": "<token symbol>"
            }
          }
          
          For deposit operations, convert them into the following format:
          {
            "function": "addLiquidity",
            "arguments": {
              "tokenA": "<token symbol>",
              "tokenB": "<token symbol>",
              "amountADesired": <number>,
              "amountBDesired": <number>
            }
          }

          For data analysis questions, convert them into the following format:
          {
            "type": "reserves" | "swaps" | "price" | "price_history" | "liquidity" | "volume" | "price_impact",
            "pool": "<token0>-<token1>",
            "timeframe": "<timeframe>" (optional),
            "token0": "<token symbol>" (optional),
            "token1": "<token symbol>" (optional),
            "period": "hour" | "day" | "week" | "month" (optional)
          }

          Examples of data analysis questions:
          - "what are the reserves of the tether-eth pool" -> {"type": "reserves", "pool": "tether-eth"}
          - "how many swaps have there been so far today" -> {"type": "swaps", "timeframe": "today"}
          - "what is the current price of eth in usdc" -> {"type": "price", "pool": "eth-usdc"}
          - "show me the price history of eth-usdc over the past week" -> {"type": "price_history", "pool": "eth-usdc", "period": "week"}
          - "what is the total liquidity in the eth-usdc pool" -> {"type": "liquidity", "pool": "eth-usdc"}
          - "what is the trading volume in the last 24 hours" -> {"type": "volume", "timeframe": "24h"}
          - "what would be the price impact of swapping 1000 usdc for eth" -> {"type": "price_impact", "pool": "eth-usdc", "amount": "1000", "token": "usdc"}
          
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
      const result = JSON.parse(cleanedResponse) as OperationResponse | DataAnalysisResponse;
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
