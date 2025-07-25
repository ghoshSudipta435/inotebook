import {React,useContext} from 'react'
import noteContext from '../context/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description} </p>
                    <button type="button" className="btn btn-outline-danger mx-2" onClick={() =>{deleteNote(note._id);
                            props.showAlert("Deleted successfully", "success");
                    }}>Delete</button>
                    <button type="button" className="btn btn-outline-success mx-2" onClick={() => {updateNote(note)
                    }}>Update</button>
                </div>
            </div>

        </div>
    )
}

export default Noteitem
