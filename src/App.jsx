import "./App.css";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setData("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setData("");

      console.log("Question:", question);

      const res = await axios.post("http://localhost:8000/ask", {
        question: question,
      });

      console.log("Backend Response:", res.data);

      if (res.data._status) {
        setData(res.data.finalData);
      } else {
        setData(res.data._message);
      }

    } catch (error) {
      console.log("Error:", error);

      setData("Unable to generate content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center font-bold text-4xl mb-5">
        Gemini AI Chat App
      </h1>

      <div className="max-w-[1320px] border mx-auto grid grid-cols-[30%_auto] gap-5 p-5">

        {/* LEFT SIDE */}
        <form
          onSubmit={handleSubmit}
          className="shadow-lg p-4"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your topic here..."
            className="w-full p-3 h-[200px] border"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#111115] text-white w-full py-2 mt-2"
          >
            {loading ? "Generating..." : "Create Content"}
          </button>
        </form>


        {/* RIGHT SIDE */}
        <div className="border-l border-[#ccc]">

          <div className="h-[500px] overflow-y-scroll p-5">

            {loading && (
              <p className="text-gray-500">
                Generating blog... Please wait.
              </p>
            )}

            {!loading && data && (
              <ReactMarkdown>
                {data}
              </ReactMarkdown>
            )}

            {!loading && !data && (
              <p className="text-gray-400">
                Your generated content will appear here...
              </p>
            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default App;