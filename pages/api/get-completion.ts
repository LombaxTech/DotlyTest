import { openai } from "@/openai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages,

      //   [
      //     {
      //       role: "system",
      //       content:
      //         "You are a helpful assistant designed to help users with social media.",
      //     },
      //     { role: "user", content: "How do I start a titkok account?" },
      //   ],
      model: "gpt-3.5-turbo-0125",
      //   response_format: { type: "json_object" },
    });
    const result = completion.choices[0].message.content;

    res.json({ message: "success", result });
  } catch (error) {
    console.log("there has been an error");
    res.json(error);
  }
}
