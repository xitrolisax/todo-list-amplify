/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify} from "@aws-amplify/core";
import '@aws-amplify/ui-react/styles.css'
import awsExports from "./aws-exports"
import { withAuthenticator, Button, Heading, Text, TextField, View, CheckboxField, SelectField, Card, Flex } from '@aws-amplify/ui-react';
import { DataStore, Predicates, syncExpression } from "@aws-amplify/datastore";
import { Todo, Category } from './models' 
Amplify.configure(awsExports); 

const initialState = { name: '', description: '', isFinished: false }
const initCategories = { name: '' }

const App = ({ signOut, user }) => { 
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])
  const [filteredByFin, setFilteredByFin] = useState('all')
  const [filteredByCategory, setFilteredByCategory] = useState('all')
  const [categoryState, setCategoryState] = useState(initCategories)
  const [categories, setCategories] = useState([])
 
  useEffect(() => {
    const subsTodo = DataStore.observeQuery(Todo).subscribe(snapshot => {
      const { items } = snapshot
      setTodos(items)
    });
    const subsCategory = DataStore.observeQuery(Category).subscribe(snapshot => {
      const { items } = snapshot
      setCategories(items)
    });
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  
  async function updatedTodo(id, value) { 
    const original = await DataStore.query(Todo, id);
    try {
      await DataStore.save(
        Todo.copyOf(original, (updated) => {
          updated.isFinished = value
        })
        )
    }
    catch (err) { 
      console.log(err);
    } 
   
  }

  async function removeToDo(todo) {
    try { 
      const todelete = await DataStore.query(Todo, todo.id);
      DataStore.delete(todelete);
    }
    catch (error) {
      console.log(error);
    }
  
  }

  async function sortList(param) {
    
    if (param == 'all') {
      try {
        const todos = await DataStore.query(Todo);
        setTodos(todos)
      } catch (err) { console.log('error fetching todos') }
    }
    else if (param == 'finished') {
      try {
        const todos = await DataStore.query(Todo, c => c.isFinished.eq(true));
        setTodos(todos)
      } catch (err) { console.log('error fetching todos') }
    }
    else if (param == 'notfinished') {
      try {
        const todos = await DataStore.query(Todo, c => c.isFinished.eq(false));
        setTodos(todos)
      } catch (err) { console.log('error fetching todos') }
    }
  }

  async function sortListByCategories(param) {
   
    if (param == 'all') {
      try {
        const todos = await DataStore.query(Todo);
        setTodos(todos)
      } catch (err) { console.log('error fetching todos') }
    }
    else {
    try {
      const todos = await DataStore.query(Todo, c => c.categoryName.eq(param));
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }
  }

  async function addTodo() {
    setInput('isFinished', false)
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      await DataStore.save(
        new Todo(todo) 
      );
      setFormState(initialState);
      setCategoryState(initCategories);
    } catch (error) {
      console.log(error);
    }
   
  }

  async function addCategory() {
    try {
      if (!categoryState.name) return
      const category = { ...categoryState }
      setCategories([...categories, category])
      await DataStore.save(
        new Category(category) 
      );
      setCategoryState(initCategories);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Flex direction="column" gap="m" wrap='wrap'> 
  <Flex direction="row" gap="xs" wrap='wrap'>
  <Heading level={3}>Hello, {user.username}!</Heading>
  <Button variation="primary" onClick={signOut}>Sign out</Button>
  </Flex> 
  <View>
 
  <Flex wrap='wrap' width='100%' direction="row" gap="m" justifyContent='flex-start' alignItems='flex-start'>
  <Card width='100%' maxWidth='1000px' variation="elevated">
  <Heading level={4}>Add a todo</Heading>
  <Flex direction="column" gap="xs">
  <TextField
    placeholder="Name"
    onChange={e => setInput('name', e.target.value)}
    defaultValue={formState.name}
  />
  <TextField
    placeholder="Description"
    onChange={e => setInput('description', e.target.value)}
    defaultValue={formState.description}
  />
{categories.length > 0 ? (
          <SelectField
            label="Category"
            labelHidden
            onChange={e => setInput('categoryName', e.target.value)}
          >
            <option value=''>- - -</option>{
            categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
            ))
          }
          </SelectField>
        
        ):(<></>)}
  <Button variation="primary" onClick={addTodo}>Create Todo</Button>
  </Flex>
  </Card>
  <Card width='100%' maxWidth='400px' variation="elevated">
  <Heading level={4}>Add new category</Heading>
  <Flex direction="column" gap="xs" justifyContent='flex-start'>
  <TextField
    placeholder="Category"
    onChange={e => setCategoryState({name: e.target.value})}
    defaultValue={categoryState.name}
  />
  <Button variation="primary" onClick={addCategory}>Create Category</Button>
  </Flex>
  </Card> 
  </Flex>
  </View>

  <Flex justifyContent='flex-end'>
  <SelectField
      label="Sort"
      labelHidden
      value={filteredByFin}
      onChange={e => {sortList(e.target.value); setFilteredByFin(e.target.value); setFilteredByCategory('all')}}
    >
       <option value="all">Show All</option>
      <option value="finished">Finished</option>
      <option value="notfinished">Not Finished</option>
    </SelectField>

    {categories.length > 0 ? (
          <SelectField
            label="Sort By Category"
            labelHidden
            value={filteredByCategory}
            onChange={e => {sortListByCategories(e.target.value);setFilteredByFin('all'); setFilteredByCategory(e.target.value)}}
          >
            <option value="all">Show All</option>
            {
            categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
            ))
          }
          </SelectField>
        
        ):(<></>)}
        </Flex>
<Flex direction="column" gap="s">
  {
    todos.map((todo, index) => (
      <View key={todo.id ? todo.id : index} >
        <Flex direction="row" gap="xs" justifyContent='flex-start' alignItems='center'>
      
         <CheckboxField
          name="isCompleted"
          value="yes"
          checked={todo.isFinished === true ? (true):(false)}
          onChange={e => updatedTodo(todo.id, e.target.checked)}
        />
        <Text>{todo.name}</Text>
        <Text>{todo.description}</Text>
        <Text>{todo.categoryName}</Text>
        <Button onClick={() => removeToDo(todo)}>Delete</Button>
      
        </Flex>
      </View>
      
    ))
  }
  </Flex>
</Flex>
  )
}



export default withAuthenticator(App);