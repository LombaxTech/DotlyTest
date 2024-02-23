import { db } from "@/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function ViewBugReports() {
  const [bugReports, setBugReports] = useState<any>([]);

  useEffect(() => {
    const initBugReports = async () => {
      try {
        let snapshot = await getDocs(collection(db, "bug-reports"));
        let reports: any = [];
        snapshot.forEach((doc) => reports.push({ id: doc.id, ...doc.data() }));
        setBugReports(reports);
      } catch (error) {
        console.log(error);
      }
    };

    initBugReports();
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
      <h1 className="">Bug Reports</h1>
      <div className="flex flex-col">
        {bugReports &&
          bugReports.map((report: any) => {
            return (
              <div className="p-2 flex flex-col border">
                <span className="">{report.bugText}</span>
                <span className="">By: {report.reportedBy.name}</span>
                <span className="">
                  Made at:{" "}
                  {report.createdAt.toDate().toLocaleDateString("en-US")}
                </span>
                <button className="btn" onClick={() => deleteReport(report)}>
                  Delete report
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
