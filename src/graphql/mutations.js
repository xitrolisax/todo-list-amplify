/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodoItem = /* GraphQL */ `
  mutation CreateTodoItem(
    $input: CreateTodoItemInput!
    $condition: ModelTodoItemConditionInput
  ) {
    createTodoItem(input: $input, condition: $condition) {
      id
      name
      description
      status
      categoryID
      category {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateTodoItem = /* GraphQL */ `
  mutation UpdateTodoItem(
    $input: UpdateTodoItemInput!
    $condition: ModelTodoItemConditionInput
  ) {
    updateTodoItem(input: $input, condition: $condition) {
      id
      name
      description
      status
      categoryID
      category {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteTodoItem = /* GraphQL */ `
  mutation DeleteTodoItem(
    $input: DeleteTodoItemInput!
    $condition: ModelTodoItemConditionInput
  ) {
    deleteTodoItem(input: $input, condition: $condition) {
      id
      name
      description
      status
      categoryID
      category {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
      id
      name
      todo {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
      id
      name
      todo {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
      id
      name
      todo {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
