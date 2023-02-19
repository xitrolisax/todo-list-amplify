/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify} from "@aws-amplify/core";
import '@aws-amplify/ui-react/styles.css'
import awsExports from "./aws-exports"
import { withAuthenticator, Button, Heading, Text, TextField, View, CheckboxField, SelectField, Card, Flex } from '@aws-amplify/ui-react';
import { DataStore, Predicates, syncExpression } from "@aws-amplify/datastore";
import { Todo, Category } from './models' 
Amplify.configure(awsExports); 

const initialState = { name: '', description: '', status: 'UNFINISHED', categoryID: '' }
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
      console.log(items)
    });
   
  }, [])

  function setInput(key, value) {
    setFormState({...formState, [key]: value})
    console.log({ ...formState, [key]: value })
  }

  
  async function updatedTodo(id, value) { 
    const original = await DataStore.query(Todo, id);
    try {
      await DataStore.save(
        Todo.copyOf(original, (updated) => {
          updated.status = value
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
    else  {
      try {
        const todos = await DataStore.query(Todo, c => c.status.eq(param));
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
      const todos = await DataStore.query(Todo, c => c.categoryID.eq(param));
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }
  }
  
  async function addTodo() {
    if (!formState.categoryID) return
    const category = await DataStore.query(Category, formState.categoryID);
   
    let newTodo;

    try { 
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
     
      setTodos([...todos, todo])
      
      newTodo = await DataStore.save(
        new Todo(todo) 
      );
    } catch (error) {
      console.log(error);
    }

    try { 
      if (!formState.categoryID) return
      await DataStore.save(
        Category.copyOf(category, (updated) => {
          updated.todo = newTodo
        })
      )
    }
    catch(e) {
        console.log(e)
      }
    
    setFormState(initialState);
    setCategoryState(initCategories);
    
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
            onChange={e => setInput('categoryID', e.target.value)}
          >
            <option id='' value=''>- - -</option>{
            categories.map((category, index) => (
            <option key={index} id={category.name} value={category.id}>{category.name}</option>
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
      <option value="FINISHED">Finished</option>
      <option value="UNFINISHED">Not Finished</option>
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
            <option key={index} value={category.id}>{category.name}</option>
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
          value={todo.status == 'FINISHED' ? ('UNFINISHED'):('FINISHED')}
          checked={todo.status == 'FINISHED' ? (true):(false)}
          onChange={e => updatedTodo(todo.id, e.target.value)}
        />
        <Text>{todo.name}</Text>
        <Text>{todo.description}</Text>
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