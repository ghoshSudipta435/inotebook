import { useState } from "react";
import NoteContext from "./noteContext";


const NoteState = (props) => {

    const host = "http://localhost:4000";
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial);

    // Add a Note
    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token') // Use correct token storage
            },
            body: JSON.stringify({ title, description, tag })
        });

        const savedNote = await response.json(); // ⬅️ Get note from server response
        setNotes(notes.concat(savedNote));        // ⬅️ Use the saved note, not a fake one
    };



    //Get all the notes

    const getNotes = async () => {
        // TODO: API CALL  


        //API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json();
        // console.log(json);
        setNotes(json);

    }


    // Delete a Note
    const deleteNote = async (id) => {
        // API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token":localStorage.getItem('token') 
            },
        });

        const result = await response.json();

        if (result.success) {
            const newNotes = notes.filter((note) => note._id !== id);
            setNotes(newNotes);
        } else {
            console.error("Delete failed:", result);
        }

    };


    // Edit Note

    const editNote = async (id, title, description, tag) => {
        //API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = response.json();
        console.log(json);

        //logic to edit in client
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];

            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }

        }
        setNotes(newNotes);

    }




    return (
        <NoteContext.Provider value={{ notes, addNote, getNotes, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>

    )
}



export default NoteState;