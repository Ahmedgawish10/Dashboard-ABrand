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
    // LISTEN (REALTIME)
    const getAllProducts = onSnapshot( collection(db, "products"),
      (snapShot) => {
        let productsList = [];

        snapShot.docs.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });

        setData(productsList);
        console.log(productsList);
        
      },
      (error) => {
        console.log(error);
      }
    );
   return ()=>{
    getAllProducts()
    }
  }, []);

  const handleDeleteProduct= async (productId) => {
              if(productId){
                toast.error("this action not allowed just for SuperAdmin");
                return;
              }
    try {
      // Delete user document from Firestore(from collection)
      let delteProduct= await deleteDoc(doc(db, "users", productId));
      // Check if the authenticated user is the same as the one being deleted
      if ( delteProduct) {
        console.log("productId deleted only from Firestore.");
      } 
  
      setData(data.filter((product) => product?.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };


  const productColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "Product",
      headerName: "Product",
      width: 180,
      renderCell: (params) => (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.image} alt="avatar" />
          {params.row.name} 
        </div>
      ),
    },
    {
      field: "Category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <div className={`text-ellipsis cellWithStatus ${params.row.category}`}>
          {params.row.category}
        </div>
      ),
    },
    {
      field: "Price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => (
        <div className={`text-ellipsis cellWithCountry ${params.row.Price}`}>
          {params.row.price}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction ">
          <Link to="/products/userId" style={{ textDecoration: "none" }}>
            <div className="viewButton text-red-500">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDeleteProduct(params.row.id)}
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
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid 55"
        rows={data}
        columns={productColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;

