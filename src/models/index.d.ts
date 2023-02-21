import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";

export enum TodoStatus {
  FINISHED = "FINISHED",
  UNFINISHED = "UNFINISHED"
}



type EagerTodoItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TodoItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: TodoStatus | keyof typeof TodoStatus;
  readonly categoryID: string;
  readonly category: Category;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTodoItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TodoItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: TodoStatus | keyof typeof TodoStatus;
  readonly categoryID: string;
  readonly category: AsyncItem<Category>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TodoItem = LazyLoading extends LazyLoadingDisabled ? EagerTodoItem : LazyTodoItem

export declare const TodoItem: (new (init: ModelInit<TodoItem>) => TodoItem) & {
  copyOf(source: TodoItem, mutator: (draft: MutableModel<TodoItem>) => MutableModel<TodoItem> | void): TodoItem;
}

type EagerCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly todo?: (TodoItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly todo: AsyncCollection<TodoItem>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Category = LazyLoading extends LazyLoadingDisabled ? EagerCategory : LazyCategory

export declare const Category: (new (init: ModelInit<Category>) => Category) & {
  copyOf(source: Category, mutator: (draft: MutableModel<Category>) => MutableModel<Category> | void): Category;
}