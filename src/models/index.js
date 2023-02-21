// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TodoStatus = {
  "FINISHED": "FINISHED",
  "UNFINISHED": "UNFINISHED"
};

const { TodoItem, Category } = initSchema(schema);

export {
  TodoItem,
  Category,
  TodoStatus
};