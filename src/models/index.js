// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TodoStatus = {
  "FINISHED": "FINISHED",
  "UNFINISHED": "UNFINISHED"
};

const { Todo, Category } = initSchema(schema);

export {
  Todo,
  Category,
  TodoStatus
};