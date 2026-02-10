import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2, Trash2, ExternalLink, Check } from "lucide-react";
import { useSheetStore } from "../store/sheetStore";
import EditModal from "./EditModal";

const difficultyStyle = {
  easy: "bg-green-50 text-green-600 border border-green-100",
  medium: "bg-yellow-50 text-yellow-600 border border-yellow-100",
  hard: "bg-red-50 text-red-500 border border-red-100",
};

export default function Question({ question, topicId, subTopicId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { deleteQuestion, updateQuestion } = useSheetStore();

  const dragId = question._id || question.id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dragId });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const handleDelete = () => {
    if (window.confirm("Delete this question?")) {
      if (!dragId) return;
      deleteQuestion(topicId, subTopicId, dragId);
    }
  };

  const difficulty = question.questionId?.difficulty?.toLowerCase();
  const name = question.questionId?.name || question.title || "Untitled Question";

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white rounded-lg border border-gray-100 px-3 py-2.5 hover:border-gray-200 hover:shadow-sm transition-all ${isCompleted ? "opacity-50" : ""}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 transition-colors shrink-0" {...attributes} {...listeners}>
              <GripVertical size={14} />
            </div>

            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                isCompleted ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-orange-400"
              }`}
            >
              {isCompleted && <Check size={10} className="text-white" strokeWidth={3} />}
            </button>

            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold text-gray-800 truncate ${isCompleted ? "line-through text-gray-400" : ""}`}>
                {name}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {difficulty && (
                  <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md capitalize ${difficultyStyle[difficulty] || "bg-gray-50 text-gray-500 border border-gray-100"}`}>
                    {question.questionId.difficulty}
                  </span>
                )}
                {question.questionId?.platform && (
                  <span className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-500 border border-blue-100">
                    {question.questionId.platform}
                  </span>
                )}
                {question.questionId?.topics?.length > 0 && (
                  <span className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-500 border border-purple-100">
                    {question.questionId.topics.slice(0, 2).join(", ")}
                    {question.questionId.topics.length > 2 && ` +${question.questionId.topics.length - 2}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {question.questionId?.problemUrl && (
              <a href={question.questionId.problemUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Open Problem">
                <ExternalLink size={13} />
              </a>
            )}
            {question.resource && (
              <a href={question.resource} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="View Resource">
                <ExternalLink size={13} />
              </a>
            )}
            <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
              <Edit2 size={13} />
            </button>
            <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditModal
          title="Edit Question"
          initialValue={name}
          onSave={(updatedName) =>
            dragId
              ? updateQuestion(topicId, subTopicId, dragId, {
                  questionId: { ...question.questionId, name: updatedName },
                })
              : null
          }
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}