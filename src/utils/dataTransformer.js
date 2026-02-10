export const transformSheetData = (apiData) => {
  const topicsMap = new Map();
  
  apiData.questions.forEach((question, index) => {
    const topicName = question.topic || 'Uncategorized';
    const subTopicName = question.subTopic || question.title || 'General';
    
    if (!topicsMap.has(topicName)) {
      topicsMap.set(topicName, {
        id: `topic-${topicName.replace(/\s+/g, '-').toLowerCase()}`,
        name: topicName,
        subTopics: new Map(),
        order: topicsMap.size,
      });
    }
    
    const topic = topicsMap.get(topicName);
    
    if (!topic.subTopics.has(subTopicName)) {
      topic.subTopics.set(subTopicName, {
        id: `subtopic-${subTopicName.replace(/\s+/g, '-').toLowerCase()}-${topic.subTopics.size}`,
        name: subTopicName,
        questions: [],
        order: topic.subTopics.size,
      });
    }
    
    const subTopic = topic.subTopics.get(subTopicName);
    const safeTopicId = topic.id;
    const safeSubTopicId = subTopic.id;
    const questionId =
      question._id ||
      question.id ||
      `question-${safeTopicId}-${safeSubTopicId}-${index}`;
    subTopic.questions.push({
      ...question,
      _id: questionId,
      order: index,
    });
  });
  
  const topics = Array.from(topicsMap.values()).map(topic => ({
    ...topic,
    subTopics: Array.from(topic.subTopics.values()),
  }));
  
  return topics;
};