import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSheetStore } from "./store/sheetStore";
import { transformSheetData } from "./utils/dataTransformer";
import Topic from "./components/Topic";
import Header from "./components/Header";
import AddTopicModal from "./components/AddTopicModal";
import { fetchSheetBySlug, syncTopics } from "./api/sheetApi";
import { BookOpen, Layers, HelpCircle } from "lucide-react";

export default function App() {
  const { topics, setTopics } = useSheetStore();
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Increased distance to prevent accidental drags
    })
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSheetBySlug("striver-sde-sheet");
        const transformedTopics = transformSheetData(data);
        setTopics(transformedTopics);
        syncTopics(transformedTopics);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [setTopics]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    // If dropped outside or in the same position, do nothing
    if (!over || active.id === over.id) return;
    
    // Find the indices
    const oldIndex = topics.findIndex((topic) => topic.id === active.id);
    const newIndex = topics.findIndex((topic) => topic.id === over.id);
    
    // Validate indices
    if (oldIndex === -1 || newIndex === -1) return;
    
    // Reorder the topics
    const reorderedTopics = arrayMove(topics, oldIndex, newIndex);
    
    // Update order property
    const updatedTopics = reorderedTopics.map((topic, index) => ({
      ...topic,
      order: index,
    }));
    
    // Update state and sync
    setTopics(updatedTopics);
    syncTopics(updatedTopics);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const totalSubTopics = topics.reduce((acc, t) => acc + t.subTopics.length, 0);
  const totalQuestions = topics.reduce(
    (acc, t) => acc + t.subTopics.reduce((s, st) => s + st.questions.length, 0),
    0
  );

  const activeTopic = topics.find((topic) => topic.id === activeId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-mono">Loading sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <Header
        onAddTopic={() => setIsAddTopicModalOpen(true)}
        topicCount={topics.length}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="flex items-center gap-3 pr-6">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <BookOpen size={15} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">Topics</p>
                <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">{topics.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Layers size={15} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">Sub-topics</p>
                <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">{totalSubTopics}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-6">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <HelpCircle size={15} className="text-purple-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">Questions</p>
                <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">{totalQuestions}</p>
              </div>
            </div>
          </div>
        </div>

        {topics.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={topics.map((topic) => topic.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {topics.map((topic, index) => (
                  <Topic key={topic.id} topic={topic} index={index} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 150 }}>
              {activeTopic ? (
                <div className="bg-white rounded-xl border border-orange-200 shadow-lg px-4 py-3 opacity-95">
                  <p className="text-sm font-bold text-gray-800">{activeTopic.name}</p>
                  <p className="text-[0.65rem] font-mono text-gray-400 mt-0.5">
                    {activeTopic.subTopics.length} sub-topics
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
              <BookOpen size={18} className="text-orange-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-700 mb-1">No topics yet</h3>
            <p className="text-xs text-gray-400">Click <span className="text-orange-500 font-semibold">Add Topic</span> to get started</p>
          </div>
        )}
      </div>

      {isAddTopicModalOpen && (
        <AddTopicModal onClose={() => setIsAddTopicModalOpen(false)} />
      )}
    </div>
  );
}