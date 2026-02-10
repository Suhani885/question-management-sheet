const BASE_URL = 'https://node.codolio.com/api/question-tracker/v1/sheet';

export const fetchSheetBySlug = async (slug = 'striver-sde-sheet') => {
  const response = await fetch(`${BASE_URL}/public/get-sheet-by-slug/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch sheet');
  const data = await response.json();
  return data.data;
};

let mockTopics = [];

export const getTopics = () => {
  return Promise.resolve({ data: mockTopics });
};

export const createTopic = (topic) => {
  const newTopic = { ...topic, id: `topic-${Date.now()}` };
  mockTopics = [...mockTopics, newTopic];
  return Promise.resolve({ data: newTopic, message: 'Topic created successfully' });
};

export const updateTopicApi = (id, updates) => {
  mockTopics = mockTopics.map((t) => (t.id === id ? { ...t, ...updates } : t));
  return Promise.resolve({ data: mockTopics.find((t) => t.id === id), message: 'Topic updated' });
};

export const deleteTopicApi = (id) => {
  mockTopics = mockTopics.filter((t) => t.id !== id);
  return Promise.resolve({ message: 'Topic deleted successfully' });
};

export const createSubTopic = (topicId, subTopic) => {
  const newSubTopic = { ...subTopic, id: `subtopic-${Date.now()}` };
  mockTopics = mockTopics.map((t) =>
    t.id === topicId ? { ...t, subTopics: [...t.subTopics, newSubTopic] } : t
  );
  return Promise.resolve({ data: newSubTopic, message: 'Sub-topic created successfully' });
};

export const updateSubTopicApi = (topicId, subTopicId, updates) => {
  mockTopics = mockTopics.map((t) =>
    t.id === topicId
      ? {
          ...t,
          subTopics: t.subTopics.map((st) =>
            st.id === subTopicId ? { ...st, ...updates } : st
          ),
        }
      : t
  );
  return Promise.resolve({ message: 'Sub-topic updated' });
};

export const deleteSubTopicApi = (topicId, subTopicId) => {
  mockTopics = mockTopics.map((t) =>
    t.id === topicId
      ? { ...t, subTopics: t.subTopics.filter((st) => st.id !== subTopicId) }
      : t
  );
  return Promise.resolve({ message: 'Sub-topic deleted successfully' });
};

export const createQuestion = (topicId, subTopicId, question) => {
  const newQuestion = { ...question, _id: `question-${Date.now()}` };
  mockTopics = mockTopics.map((t) =>
    t.id === topicId
      ? {
          ...t,
          subTopics: t.subTopics.map((st) =>
            st.id === subTopicId
              ? { ...st, questions: [...st.questions, newQuestion] }
              : st
          ),
        }
      : t
  );
  return Promise.resolve({ data: newQuestion, message: 'Question created successfully' });
};

export const updateQuestionApi = (topicId, subTopicId, questionId, updates) => {
  mockTopics = mockTopics.map((t) =>
    t.id === topicId
      ? {
          ...t,
          subTopics: t.subTopics.map((st) =>
            st.id === subTopicId
              ? {
                  ...st,
                  questions: st.questions.map((q) =>
                    q._id === questionId ? { ...q, ...updates } : q
                  ),
                }
              : st
          ),
        }
      : t
  );
  return Promise.resolve({ message: 'Question updated' });
};

export const deleteQuestionApi = (topicId, subTopicId, questionId) => {
  mockTopics = mockTopics.map((t) =>
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
  );
  return Promise.resolve({ message: 'Question deleted successfully' });
};

export const syncTopics = (topics) => {
  mockTopics = topics;
  return Promise.resolve({ message: 'Synced successfully' });
};