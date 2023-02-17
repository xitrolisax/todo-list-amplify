/* src/App.js */
import React, { useEffect, useState } from 'react'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import awsExports from "./aws-exports"
import { withAuthenticator, Button, Heading, Text, TextField, View, CheckboxField } from '@aws-amplify/ui-react';
import Styles from './index.scss'
import { DataStore } from 'aws-amplify'
import { Todo } from './models'

Amplify.configure(awsExports); 

const initialState = { name: '', description: '', isFinished: false }


const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
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
  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await DataStore.save(
        new Todo(todo)
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={Styles.container}>
    <View style={Styles.navContainer}>
  <Heading level={1}>Hello {user.username}</Heading>
  <Button style={Styles.button}onClick={signOut}>Sign out</Button>
  </View>
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
  <Button style={Styles.button} onClick={addTodo}>Create Todo</Button>
  {
    todos.map((todo, index) => (
      <View key={todo.id ? todo.id : index} style={Styles.todo}>
         <CheckboxField
          name="isCompleted"
          value="yes"
          checked={todo.isFinished === true ? (true):(false)}
          onChange={e => updatedTodo(todo.id, e.target.checked)}
        />
        <Text style={Styles.todoName}>{todo.name}</Text>
        <Text style={Styles.todoDescription}>{todo.description}</Text>
      </View>
    ))
  }
</View>
  )
}



export default withAuthenticator(App);