import { db } from "@/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function FeedbackAndReports() {
  const [bugReports, setBugReports] = useState<any>([]);
  const [feedbacks, setFeedbacks] = useState<any>([]);

  const [mode, setMode] = useState<"bug-reports" | "feedback">("bug-reports");

  useEffect(() => {
    const init = async () => {
      try {
        let snapshot = await getDocs(collection(db, "bug-reports"));
        let reports: any = [];
        snapshot.forEach((doc) => reports.push({ id: doc.id, ...doc.data() }));
        setBugReports(reports);

        snapshot = await getDocs(collection(db, "feedback"));
        let feedbacks: any = [];
        snapshot.forEach((doc) =>
          feedbacks.push({ id: doc.id, ...doc.data() })
        );
        setFeedbacks(feedbacks);
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

  const deleteReport = async (report: any) => {
    try {
      await deleteDoc(doc(db, "bug-reports", report.id));
      console.log("deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 flex flex-col">
      <div className="flex justify-center items-center gap-2">
        <h1
          className={`text-2xl cursor-pointer ${
            mode === "bug-reports" ? "underline" : ""
          }`}
          onClick={() => setMode("bug-reports")}
        >
          Bug Reports
        </h1>
        <h1
          className={`text-2xl cursor-pointer ${
            mode === "feedback" ? "underline" : ""
          }`}
          onClick={() => setMode("feedback")}
        >
          Feedback
        </h1>
      </div>

      {mode === "bug-reports" && (
        <div className="flex flex-col">
          <h1 className="">Bug Reports</h1>
          <div className="flex flex-col">
            {bugReports &&
              bugReports.map((report: any, i: any) => {
                return (
                  <div className="p-2 flex flex-col border" key={i}>
                    <span className="">{report.bugText}</span>
                    <span className="">By: {report.reportedBy.name}</span>
                    <span className="">
                      Made at:{" "}
                      {report.createdAt.toDate().toLocaleDateString("en-US")}
                    </span>
                    {report.imageUrl ? (
                      <img
                        src={report.imageUrl}
                        className="w-[250px] aspect-auto"
                      />
                    ) : null}
                    <button
                      className="btn"
                      onClick={() => deleteReport(report)}
                    >
                      Delete report
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {mode === "feedback" && (
        <div className="flex flex-col">
          <h1 className="">Feedback</h1>
          <div className="flex flex-col">
            {feedbacks &&
              feedbacks.map((feedback: any, i: any) => {
                return (
                  <div className="p-2 flex flex-col border" key={i}>
                    <span className="">{feedback.feedbackText}</span>
                    <span className="">By: {feedback.user.name}</span>
                    <span className="">
                      Made at:{" "}
                      {feedback.createdAt.toDate().toLocaleDateString("en-US")}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
