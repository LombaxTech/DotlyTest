import React, { useState } from "react";
import { openai } from "@/openai";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default function Test() {
  const [generation, setGeneration] = useState<any>("");

  const generateSomething = async () => {
    try {
      console.log("trying to generate something");

      let res = await axios.get(`${url}/api/get-completion`);
      console.log(res);

      setGeneration(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 flex justify-center">
      <div className="flex flex-col gap-4">
        <h1>Test Page</h1>
        <button className="btn" onClick={generateSomething}>
          Generate something
        </button>

        {generation && <div className="">{generation}</div>}
      </div>
    </div>
  );
}
