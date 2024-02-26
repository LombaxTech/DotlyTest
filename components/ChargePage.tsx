import React from "react";

export default function ChargePage() {
  return (
    <div className="min-h-screen flex-1 flex justify-center pt-32">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium">
          It seems like you did not fill out the feedback form within the past
          30 days.
        </h1>
        <button className="btn w-fit mx-auto">
          Pay £4.99 To Resume Using Dotly
        </button>
      </div>
    </div>
  );
}
