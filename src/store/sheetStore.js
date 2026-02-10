import { create } from 'zustand';
import {
  createTopic,
  updateTopicApi,
  deleteTopicApi,
  createSubTopic,
  updateSubTopicApi,
  deleteSubTopicApi,
  createQuestion,
  updateQuestionApi,
  deleteQuestionApi,
} from '../api/sheetApi';

export const useSheetStore = create((set) => ({
  topics: [],

  setTopics: (topics) => set({ topics }),

  addTopic: (name) => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      name,
      subTopics: [],
      order: 0,
    };
    createTopic(newTopic).then((res) => console.log(res.message));
    set((state) => ({
      topics: [...state.topics, { ...newTopic, order: state.topics.length }],
    }));
  },

  updateTopic: (id, name) => {
    updateTopicApi(id, { name }).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, name } : t)),
    }));
  },

  deleteTopic: (id) => {
    deleteTopicApi(id).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== id),
    }));
  },

  reorderTopics: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.topics);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return {
      topics: result.map((topic, index) => ({ ...topic, order: index })),
    };
  }),

  addSubTopic: (topicId, name) => {
    const newSubTopic = {
      id: `subtopic-${Date.now()}`,
      name,
      questions: [],
      order: 0,
    };
    createSubTopic(topicId, newSubTopic).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subTopics: [...t.subTopics, { ...newSubTopic, order: t.subTopics.length }] }
          : t
      ),
    }));
  },

  updateSubTopic: (topicId, subTopicId, name) => {
    updateSubTopicApi(topicId, subTopicId, { name }).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subTopics: t.subTopics.map((st) => (st.id === subTopicId ? { ...st, name } : st)) }
          : t
      ),
    }));
  },

  deleteSubTopic: (topicId, subTopicId) => {
    deleteSubTopicApi(topicId, subTopicId).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subTopics: t.subTopics.filter((st) => st.id !== subTopicId) }
          : t
      ),
    }));
  },

  reorderSubTopics: (topicId, startIndex, endIndex) => set((state) => ({
    topics: state.topics.map((topic) => {
      if (topic.id !== topicId) return topic;
      const result = Array.from(topic.subTopics);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...topic, subTopics: result.map((st, index) => ({ ...st, order: index })) };
    }),
  })),

  addQuestion: (topicId, subTopicId, question) => {
    createQuestion(topicId, subTopicId, question).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? { ...st, questions: [...st.questions, { ...question, _id: `question-${Date.now()}` }] }
                  : st
              ),
            }
          : t
      ),
    }));
  },

  updateQuestion: (topicId, subTopicId, questionId, updatedQuestion) => {
    updateQuestionApi(topicId, subTopicId, questionId, updatedQuestion).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? { ...st, questions: st.questions.map((q) => (q._id === questionId ? { ...q, ...updatedQuestion } : q)) }
                  : st
              ),
            }
          : t
      ),
    }));
  },

  deleteQuestion: (topicId, subTopicId, questionId) => {
    deleteQuestionApi(topicId, subTopicId, questionId).then((res) => console.log(res.message));
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? { ...st, questions: st.questions.filter((q) => q._id !== questionId) }
                  : st
              ),
            }
          : t
      ),
    }));
  },

  reorderQuestions: (topicId, subTopicId, startIndex, endIndex) => set((state) => ({
    topics: state.topics.map((topic) => {
      if (topic.id !== topicId) return topic;
      return {
        ...topic,
        subTopics: topic.subTopics.map((subTopic) => {
          if (subTopic.id !== subTopicId) return subTopic;
          const result = Array.from(subTopic.questions);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { ...subTopic, questions: result };
        }),
      };
    }),
  })),
}));