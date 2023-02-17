/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify} from "@aws-amplify/core";
import '@aws-amplify/ui-react/styles.css'
import awsExports from "./aws-exports"
import { withAuthenticator, Button, Heading, Text, TextField, View, CheckboxField, SelectField } from '@aws-amplify/ui-react';
import Styles from './index.scss'
import { DataStore, Predicates, syncExpression } from "@aws-amplify/datastore";
import { Todo, Category } from './models' 

Amplify.configure(awsExports); 



const initialState = { name: '', description: '', isFinished: false }
const initCategories = {name:''}

const App = ({ signOut, user }) => { 
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  const [categoryState, setCategoryState] = useState(initCategories)
  const [categories, setCategories] = useState([])
 
  useEffect(() => {
    fetchTodos() 
    fetchCategories()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }


  async function fetchTodos() {
   
    try {
      const todos = await DataStore.query(Todo);
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
    
  }
  async function fetchCategories() {
   
    try {
      const categories = await DataStore.query(Category);
      setCategories(categories)
    } catch (err) { console.log('error fetching categories') }
    
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
    fetchTodos();
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
      fetchTodos();
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
    try {
      const todos = await DataStore.query(Todo, c => c.category.eq(param.id));
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
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
    <View style={Styles.container}>
  <View>
  <Heading level={1}>Hello, {user.username}!</Heading>
  <Button style={Styles.button}onClick={signOut}>Sign out</Button>
  </View>
  <View>
  <Heading level={2}>Amplify Todos</Heading>
  <TextField
    placeholder="Name"
    onChange={e => setInput('name', e.target.value)}
    style={Styles.input}
    defaultValue={formState.name}
  />
  <TextField
    placeholder="Description"
    onChange={e => setInput('description', e.target.value)}
    style={Styles.input}
    defaultValue={formState.description}
  />
{categories.length > 0 ? (
          <SelectField
            label="Category"
            labelHidden
            onChange={e => setInput('category', e.target.value)}
          >{
            categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
            ))
          }
          </SelectField>
        
        ):(<></>)}
  <Button style={Styles.button} onClick={addTodo}>Create Todo</Button>

  <TextField
    placeholder="Category"
    onChange={e => setCategoryState({name: e.target.value})}
    style={Styles.input}
    defaultValue={categoryState.name}
  />
  <Button style={Styles.button} onClick={addCategory}>Create Category</Button>
  </View>
  <SelectField
      label="Sort"
      labelHidden
      onChange={e => sortList(e.target.value)}
    >
       <option value="all">Show All</option>
      <option value="finished">Finished</option>
      <option value="notfinished">Not Finished</option>
    </SelectField>

    {categories.length > 0 ? (
          <SelectField
            label="Sort By Category"
            labelHidden
            onChange={e => sortListByCategories(e.target.value)}
          >{
            categories.map((category, index) => (
            <option key={index} value={category}>{category.name}</option>
            ))
          }
          </SelectField>
        
        ):(<></>)}
  <View>
  {
    todos.map((todo, index) => (
      <View key={todo.id ? todo.id : index} style={Styles.todo}>
        <View>
         <CheckboxField
          name="isCompleted"
          value="yes"
          checked={todo.isFinished === true ? (true):(false)}
          onChange={e => updatedTodo(todo.id, e.target.checked)}
        />
        <Text style={Styles.todoName}>{todo.name}</Text>
        <Text style={Styles.todoDescription}>{todo.description}</Text>
        <Text style={Styles.todoDescription}>{todo.category}</Text>
        <Button style={Styles.button} onClick={() => removeToDo(todo)}>Delete</Button>
        </View>
        
      </View>
      
    ))
  }
  </View>
</View>
  )
}



export default withAuthenticator(App);