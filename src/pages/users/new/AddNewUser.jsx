import "./new.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const AddNewUser = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const uploadFile = () => {
      // Generate a unique name using a timestamp and a random identifier
      const uniqueName = `${new Date().getTime()}-${Math.random().toString(36).substring(2, 15)}-${file.name}`;

      const storageRef = ref(storage, `products/${uniqueName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
              
      uploadTask.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPerc(progress.toFixed(0));          
        },(error) => {
          console.log(error);
        },(getImageUrl) => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
            
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);
  


  const handleInputsUpload = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData({ ...data, [name]: value });
    console.log(data);
        
  };

  const addNewUser = async (e) => {
    
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      navigate("/users")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new h-[100vh]">
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left flex flex-col items-center justify-center">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="add imgae user"
            />
                        <div className="text-green-500 pt-5">   {per?` image uploaded${per}%`:"...."}            </div>


          </div>
          <div className="right">
            <form onSubmit={addNewUser}>
              <div className="formInput ">
                <label htmlFor="file" className=" h-[100%] cursor-pointer">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.name}>
                  <label>{input.label}</label>
                  <input
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInputsUpload}
                  />
                </div>
              ))}
              <button disabled={per !== null && per < 100} type="submit">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;
