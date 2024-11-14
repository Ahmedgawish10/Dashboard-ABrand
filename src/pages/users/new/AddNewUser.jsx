// import "./new.css";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
// import { useEffect, useState } from "react";
// import { addDoc, collection,setDoc,doc } from "firebase/firestore";
// import { auth, db, storage } from "../../../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const AddNewUser = ({ inputs, title }) => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState({});
//   const [progress, setProgress] = useState(null);
//   const navigate = useNavigate();

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     // Check if all required fields are filled and a file is uploaded
//     if (file == null || Object.keys(data).length < inputs.length) {
//       toast.error("All fields are required");
//       return;
//     }

//     try {
//       // Create user in Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );
//       const userId = userCredential.user.uid;

//       // Upload profile image to Firebase Storage
//       const storageRef = ref(storage, `userImages/${file.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setProgress(progress.toFixed());
//         },
//         (error) => {
//           console.error("Upload failed", error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           try {
//             // Save user details to Firestore
//             await setDoc(doc(db, "users", userId), {
//               ...data,
//               imageUrl: downloadURL,
//               createdAt: new Date()
//             });

//             toast.success("User created successfully");
//             navigate("/users"); // Redirect to the users list page
//           } catch (error) {
//             console.error("Error saving user to Firestore", error);
//           }
//         }
//       );
//     } catch (error) {
//       console.error("Error creating user", error);
//       toast.error("Error creating user");
//     }
//   };

//   const handleInputsChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setData({ ...data, [name]: value });
//   };

//   return (
//     <div className="new h-[100vh]">
//       <div className="newContainer">
//         <div className="top">
//           <h1>{title}</h1>
//         </div>
//         <div className="bottom">
//           <div className="left flex flex-col items-center justify-center">
//             <img
//               src={
//                 file
//                   ? URL.createObjectURL(file)
//                   : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
//               }
//               alt="add image user"
//             />
//             <div className="text-green-500 pt-5">
//               {progress ? `Image uploaded ${progress}%` : "...."}
//             </div>
//           </div>
//           <div className="right">
//             <form onSubmit={handleUpload}>
//               <div className="formInput">
//                 <label htmlFor="file" className="h-[100%] cursor-pointer">
//                   Profile Image: <DriveFolderUploadOutlinedIcon className="icon" />
//                 </label>
//                 <input
//                   type="file"
//                   id="file"
//                   name="file"
//                   onChange={(e) => setFile(e.target.files[0])}
//                   style={{ display: "none" }}
//                 />
//               </div>

//               {inputs.map((input) => (
//                 <div className="formInput" key={input.name}>
//                   <label>{input.label}</label>
//                   <input
//                     name={input.name}
//                     type={input.type}
//                     placeholder={input.placeholder}
//                     onChange={handleInputsChange}
//                   />
//                 </div>
//               ))}
//               <button disabled={progress !== null && progress < 100} type="submit">
//                 Add User
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewUser;
import "./new.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { addDoc, collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddNewUser = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    // check if all required fields are filled and a file is uploaded
    if (file == null || Object.keys(data).length < inputs.length) {
      toast.error("All fields are required");
      return;
    }

    const storageRef = ref(storage, `userImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress.toFixed());
      },
      (error) => {
        console.error('Upload failed', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          const userRef = doc(db, 'users', data.email); 
          await setDoc(userRef, {
            ...data,
            profileImage: downloadURL, // Add profile image URL
            createdAt: serverTimestamp(),
          });
          // Redirect after successful user creation
          toast.success("User created successfully");
          navigate('/users'); // Navigate to users list page
        } catch (error) {
          console.error("Error saving to Firestore", error);
        }
      }
    );
  };

  const handleInputsChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
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
              alt="add image user"
            />
            <div className="text-green-500 pt-5">
              {progress ? `Image uploaded ${progress}%` : "...."}
            </div>
          </div>
          <div className="right">
            <form onSubmit={handleUpload}>
              <div className="formInput">
                <label htmlFor="file" className="h-[100%] cursor-pointer">
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
                    onChange={handleInputsChange}
                  />
                </div>
              ))}

              <button disabled={progress !== null && progress < 100} type="submit">
                Add User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;

