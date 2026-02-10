import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useSheetStore } from "../store/sheetStore";

export default function AddQuestionModal({ topicId, subTopicId, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    difficulty: "Medium",
    platform: "",
    problemUrl: "",
    resource: "",
    topics: "",
  });
  const { addQuestion } = useSheetStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      const question = {
        questionId: {
          _id: `q-${Date.now()}`,
          name: formData.name.trim(),
          difficulty: formData.difficulty,
          platform: formData.platform.trim(),
          problemUrl: formData.problemUrl.trim(),
          topics: formData.topics.split(",").map((t) => t.trim()).filter(Boolean),
        },
        topic: "",
        title: formData.name.trim(),
        subTopic: "",
        resource: formData.resource.trim(),
      };
      addQuestion(topicId, subTopicId, question);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputCls = "w-full px-3 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 placeholder:text-gray-300 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const difficultyColor = {
    Easy: "text-green-600 bg-green-100 border-green-200",
    Medium: "text-yellow-600 bg-yellow-100 border-yellow-200",
    Hard: "text-red-500 bg-red-100 border-red-200",
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">New Question</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">

            <div>
              <label className={labelCls}>Question Name *</label>
              <input
                type="text"
                name="name"
                autoFocus
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Two Sum"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={`${difficultyColor[formData.difficulty]} outline-none w-full px-3 py-2.5 text-sm text-gray-800 bg-gray-50 rounded-lg font-semibold`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  placeholder="e.g. LeetCode"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Problem URL</label>
              <input
                type="url"
                name="problemUrl"
                value={formData.problemUrl}
                onChange={handleChange}
                placeholder="https://leetcode.com/problems/..."
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Resource URL <span className="normal-case font-normal text-gray-400">(optional)</span></label>
              <input
                type="url"
                name="resource"
                value={formData.resource}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Topics <span className="normal-case font-normal text-gray-400">(comma-separated)</span></label>
              <input
                type="text"
                name="topics"
                value={formData.topics}
                onChange={handleChange}
                placeholder="e.g. Arrays, Hash Table, Two Pointers"
                className={inputCls}
              />
            </div>

          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-[0_2px_8px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_12px_rgba(249,115,22,0.4)] transition-all duration-150"
            >
              <Plus size={13} strokeWidth={3} />
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}