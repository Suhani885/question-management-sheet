import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, GripVertical, Plus, Edit2, Trash2 } from "lucide-react";
import { useSheetStore } from "../store/sheetStore";
import SubTopic from "./SubTopic";
import AddSubTopicModal from "./AddSubTopicModal";
import EditModal from "./EditModal";

export default function Topic({ topic }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddSubTopicModalOpen, setIsAddSubTopicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateTopic, deleteTopic, reorderSubTopics } = useSheetStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${topic.name}" and all its content?`)) {
      deleteTopic(topic.id);
    }
  };

  const handleSubTopicDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = topic.subTopics.findIndex((st) => st.id === active.id);
    const newIndex = topic.subTopics.findIndex((st) => st.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    reorderSubTopics(topic.id, oldIndex, newIndex);
  };

  const totalQuestions = topic.subTopics.reduce((acc, st) => acc + st.questions.length, 0);

  return (
    <>
      <div ref={setNodeRef} style={style} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 transition-colors shrink-0"
                {...attributes}
                {...listeners}
              >
                <GripVertical size={16} />
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{topic.name}</h2>
                <p className="text-[0.65rem] font-mono text-gray-400 mt-0.5">
                  {topic.subTopics.length} sub-topics · {totalQuestions} questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsAddSubTopicModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                title="Add Sub-topic"
              >
                <Plus size={15} />
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                title="Edit Topic"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Topic"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3">
            {topic.subTopics.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSubTopicDragEnd}>
                <SortableContext items={topic.subTopics.map((st) => st.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {topic.subTopics.map((subTopic, idx) => (
                      <SubTopic key={subTopic.id} subTopic={subTopic} topicId={topic.id} index={idx} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-6 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">
                <p className="text-xs text-gray-400">No sub-topics yet — click <span className="text-orange-400 font-semibold">+</span> to add one.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isAddSubTopicModalOpen && (
        <AddSubTopicModal topicId={topic.id} onClose={() => setIsAddSubTopicModalOpen(false)} />
      )}

      {isEditModalOpen && (
        <EditModal
          title="Edit Topic"
          initialValue={topic.name}
          onSave={(name) => updateTopic(topic.id, name)}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}