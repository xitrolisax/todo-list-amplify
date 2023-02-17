// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Todo, Category } = initSchema(schema);

export {
  Todo,
  Category
};