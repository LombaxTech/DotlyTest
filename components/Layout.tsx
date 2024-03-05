import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Link from "next/link";
import ChargePage from "./ChargePage";
import { getDifferenceInDays, getFormattedFutureDate } from "@/helperFunctions";

type Status = "" | "remind" | "banned";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading } = useContext(AuthContext);

  const [status, setStatus] = useState<Status>("");

  const [warningDate, setWarningDate] = useState("");

  // temporarily pause site
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen max-h-screen">
  //     <h1 className="text-4xl font-bold">
  //       This demo is currently offline. Come back later!
  //     </h1>
  //   </div>
  // );

  useEffect(() => {
    // return;
    if (!user || user?.setup === false || !user.createdAt) return setStatus("");

    let isNotTimeStamp = user.createdAt instanceof Date;

    let days: any;

    if (user.submittedFeedback) {
      days = getDifferenceInDays(
        new Date(),
        user.submittedFeedback.lastSubmitted.toDate()
      );

      setWarningDate(
        getFormattedFutureDate(
          user.submittedFeedback.lastSubmitted.toDate(),
          30
        )
      );
    }

    if (!user.submittedFeedback) {
      if (isNotTimeStamp) {
        days = getDifferenceInDays(new Date(), user?.createdAt);
        setWarningDate(getFormattedFutureDate(user?.createdAt, 30));
      } else {
        days = getDifferenceInDays(new Date(), user?.createdAt?.toDate());
        setWarningDate(getFormattedFutureDate(user?.createdAt?.toDate(), 30));
      }
    }

    console.log(days);

    // days = 50;

    // If user first time since creating account
    if (!user.submittedFeedback) {
      if (days >= 30) setStatus("banned");
      if (days < 30) setStatus("remind");
    }
    // if user has just submitted
    else if (user.submittedFeedback) {
      if (days >= 30) setStatus("banned");
      if (days < 30 && days > 8) setStatus("remind");
      if (days < 8) setStatus("");
    }

    console.log(`days: ${days}`);
  }, [user]);

  // return <ChargePage />;

  return (
    <div className="flex flex-col min-h-screen max-h-screen">
      {status === "remind" && <FeedbackWarning dateLimit={warningDate} />}

      <Navbar didNotFillOutFeedbackForm={status === "banned"} />

      {status === "banned" ? (
        <ChargePage />
      ) : (
        <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
      )}
    </div>
  );
}

const FeedbackWarning = ({ dateLimit }: { dateLimit: string }) => {
  return (
    <div className="p-2 flex justify-center border w-full bg-yellow-500 text-white font-bold">
      <Link href={"/feedback"}>
        <h1 className="underline">
          {`Leave feedback before ${dateLimit} to keep using the free trial!`}
        </h1>
      </Link>
    </div>
  );
};
