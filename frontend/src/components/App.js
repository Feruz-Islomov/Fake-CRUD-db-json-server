import React, { useEffect, useState } from "react";
import AddContact from "./AddContact";
import "./App.css";
import ContactList from "./ContactList";
// import Header from "./Header";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ContactDetail from "./ContactDetail";
import api from "../api/contacts";
import EditContact from "./EditContact";

function App() {
  const [contacts, setContacts] = useState([]);

  const addContactHandler = async (contact) => { //   <=  this is object of contact
    const request = {
      id: uuidv4(),
      ...contact,
    };
    const response = await api.post("/contacts", request);
    console.log(response);
    setContacts([...contacts, response.data]); // set of objects + object
    console.log(contact);   //   <=  this is object of contact
  };
  const RemoveContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });
    setContacts(newContactList);
  };
  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    console.log(response.data);
    // eslint-disable-next-line
    const { id, name, email } = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  };
  //retrieveContacts
  const retrieveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };

  useEffect(() => {
    // const FromLocalStorage = JSON.parse(localStorage.getItem("contacts"));
    // if (FromLocalStorage) setContacts(FromLocalStorage);
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if (allContacts) setContacts(allContacts);
    };
    getAllContacts();
  }, []);

  // useEffect(() => {
  //   console.log(contacts);
  //   // localStorage.setItem("contacts", JSON.stringify(contacts));
  // }, [contacts]);

  return (
    <div className="ui container">
      <Router>
        <Switch>
          <Route  path="/"  exact  render={(props) => ( <ContactList  {...props}  getContactId={RemoveContactHandler} contacts={contacts} />  )}
            // component={() => ( <ContactList  getContactId={RemoveContactHandler}  contacts={contacts} /> )}
          />
          <Route  path="/add"   render={(props) => (  <AddContact {...props} addContactHandler={addContactHandler} />  )}
            // component={() => ( <AddContact addContactHandler={addContactHandler} /> )}
          />
          <Route path="/edit"   render={(props) => (  <EditContact   {...props}  updateContactHandler={updateContactHandler}  />  )} />
          <Route path="/contact/:id" component={ContactDetail} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
