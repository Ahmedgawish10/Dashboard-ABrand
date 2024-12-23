import "./datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc,onSnapshot,query,where } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import toast from "react-hot-toast";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [usersId,setUsersId]=useState([]);
  useEffect(() => {
    // REALTIME for users get
    const getAllUsers = onSnapshot( collection(db, "users"),
      (snapShot) => {
        let usersList = [];
        let usersListIds = []; 

        snapShot.docs.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
          usersListIds.push(doc.id); 
        });

        setData(usersList);
        setUsersId(usersListIds);         
      },
      (error) => {
        console.log(error);
      }
    );
   return ()=>{
      getAllUsers()
    }
  }, []);

  const handleDeleteUser = async (userId) => {
              if(userId){
                toast.error("this action not allowed just for SuperAdmin");
                return;
              }
    try {
      await deleteDoc(doc(db, "users", userId));
      if ( usersId.includes(userId)) {
        await auth.currentUser.delete();

      } else {
        console.log("User deleted only from Firestore.");
      }
  
      setData(data.filter((user) => user?.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };


  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 180,
      renderCell: (params) => (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.profileImage} alt="avatar" />
          {params.row.username} 
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <div className={`text-ellipsis cellWithStatus ${params.row.email}`}>
          {params.row.email}
        </div>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      width: 100,
      renderCell: (params) => (
        <div className={`text-ellipsis cellWithCountry ${params.row.country}`}>
          {params.row.country}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction ">
          <Link to="/users" style={{ textDecoration: "none" }}>
            <div className="viewButton text-red-500">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable  ">

      <div className="datatableTitle">
        Add New User
        <Link to="/users/addUser" className="link">
          Add User
        </Link>
      </div>
      <DataGrid
        className="datagrid 55"
        rows={data}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;

