import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, GripVertical, Plus, Edit2, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSheetStore } from "../store/sheetStore";
import Question from "./Question";
import AddQuestionModal from "./AddQuestionModal";
import EditModal from "./EditModal";

export default function SubTopic({ subTopic, topicId }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateSubTopic, deleteSubTopic, reorderQuestions } = useSheetStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: subTopic.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const handleDelete = () => {
    if (window.confirm(`Delete "${subTopic.name}" and all its questions?`)) {
      deleteSubTopic(topicId, subTopic.id);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = subTopic.questions.findIndex((q) => (q._id || q.id) === active.id);
    const newIndex = subTopic.questions.findIndex((q) => (q._id || q.id) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    reorderQuestions(topicId, subTopic.id, oldIndex, newIndex);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="bg-gray-50/70 rounded-lg border border-gray-100">
        <div className="px-3 py-2.5 border-b border-gray-100 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 transition-colors shrink-0" {...attributes} {...listeners}>
                <GripVertical size={15} />
              </div>
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-gray-800 truncate">{subTopic.name}</h3>
                <p className="text-[0.6rem] font-mono text-gray-400">{subTopic.questions.length} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button onClick={() => setIsAddQuestionModalOpen(true)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Add Question">
                <Plus size={14} />
              </button>
              <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit Sub-topic">
                <Edit2 size={13} />
              </button>
              <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Sub-topic">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-2.5">
            {subTopic.questions.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={subTopic.questions.map((q) => q._id || q.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1.5">
                    {subTopic.questions.map((question, idx) => (
                      <Question key={question._id || question.id} question={question} topicId={topicId} subTopicId={subTopic.id} index={idx} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-5 rounded-lg border border-dashed border-gray-200 bg-white">
                <p className="text-xs text-gray-400">No questions yet — click <span className="text-orange-400 font-semibold">+</span> to add one.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isAddQuestionModalOpen && (
        <AddQuestionModal topicId={topicId} subTopicId={subTopic.id} onClose={() => setIsAddQuestionModalOpen(false)} />
      )}
      {isEditModalOpen && (
        <EditModal title="Edit Sub-topic" initialValue={subTopic.name} onSave={(name) => updateSubTopic(topicId, subTopic.id, name)} onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
}