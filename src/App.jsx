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
import {
  BookOpen,
  Layers,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const { topics, setTopics } = useSheetStore();
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
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
    if (!over || active.id === over.id) return;

    const oldIndex = topics.findIndex((topic) => topic.id === active.id);
    const newIndex = topics.findIndex((topic) => topic.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedTopics = arrayMove(topics, oldIndex, newIndex);
    const updatedTopics = reorderedTopics.map((topic, index) => ({
      ...topic,
      order: index,
    }));

    setTopics(updatedTopics);
    syncTopics(updatedTopics);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const totalSubTopics = topics.reduce((acc, t) => acc + t.subTopics.length, 0);
  const totalQuestions = topics.reduce(
    (acc, t) => acc + t.subTopics.reduce((s, st) => s + st.questions.length, 0),
    0,
  );

  const completedQuestions = topics.reduce(
    (acc, t) =>
      acc +
      t.subTopics.reduce(
        (s, st) => s + st.questions.filter((q) => q.completed).length,
        0,
      ),
    0,
  );

  const completionPercentage =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  const activeTopic = topics.find((topic) => topic.id === activeId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
      <Header
        onAddTopic={() => setIsAddTopicModalOpen(true)}
        topicCount={topics.length}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Progress</h2>
              <p className="text-orange-100 text-sm">
                Keep going! You're doing great
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <p className="text-3xl font-bold">{completionPercentage}%</p>
              <p className="text-[0.7rem] text-orange-100 mt-0.5">Complete</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">
                  Topics
                </p>
                <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                  {topics.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Layers size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">
                  Sub-topics
                </p>
                <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                  {totalSubTopics}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <HelpCircle size={18} className="text-purple-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">
                  Questions
                </p>
                <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                  {totalQuestions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-wider">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
                  {completedQuestions}
                </p>
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
                <div className="bg-white rounded-xl border-2 border-orange-300 shadow-2xl px-5 py-4 opacity-95">
                  <p className="text-base font-bold text-gray-800">
                    {activeTopic.name}
                  </p>
                  <p className="text-[0.7rem] font-mono text-gray-400 mt-1">
                    {activeTopic.subTopics.length} sub-topics
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No topics yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Start building your learning journey
            </p>
            <button
              onClick={() => setIsAddTopicModalOpen(true)}
              className="px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors"
            >
              Add Your First Topic
            </button>
          </div>
        )}
      </div>

      {isAddTopicModalOpen && (
        <AddTopicModal onClose={() => setIsAddTopicModalOpen(false)} />
      )}
    </div>
  );
}
