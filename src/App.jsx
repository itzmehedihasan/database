import { useEffect, useState } from "react";
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { ThreeDots } from 'react-loader-spinner';

function App() {
  const db = getDatabase();
  const [task, setTask] = useState("");
  const [loader, setLoader] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");

  const handlePostData = () => {
    setLoader(true);
    push(ref(db, 'todo/'), {
      username: task,
    }).then(() => {
        setLoader(false);
        setTask("");
        console.log("done");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  useEffect(() => {
    const starCountRef = ref(db, 'todo/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        arr.push({...item.val(),id: item.key});
      })
      setTaskList(arr)
    });
  }, [db]);

  let handleEdit = (item)=>{
    console.log(item);
    setIsEdit(true)
    setTask(item.username)
    setId(item.id)
  }

  const handleUpdate = () => {
    set(ref(db, 'todo/'+id), {
      username: task,
    })
      .then(() => {
        setLoader(false);
        setTask("");
        setIsEdit(false)
        console.log("done");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

 let handleDelete=(item)=>{
    remove(ref(db, 'todo/'+item.id))
  }

  return (
    <>
    <h1>Todo</h1>
      <input onChange={(e) => setTask(e.target.value)} value={task} />
      {isEdit?
      <button onClick={handleUpdate}>Update</button>
      :
      loader ? (
        <button>
        <ThreeDots
        visible={true}
        height="50"
        width="50"
        color="#13bee9"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </button>
      ) : (
        <button onClick={handlePostData}>Post</button>
      )}

      <ol>
        {taskList.map((item) => (
          <li>{item.username}
          <button onClick={()=>handleEdit(item)}>Edit</button>
          <button onClick={()=>handleDelete(item)}>Delete</button>
          </li>
          )
        
        )}
      </ol>

    </>
  );
}

export default App;

//                npm run dev
