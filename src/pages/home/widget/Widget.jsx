import "./widget.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs ,onSnapshot} from "firebase/firestore";
import { db } from "../../../firebase";

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        query:"users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "product":
      data = {
        title: "PRODUCTS",
        query:"products",
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const today = new Date();
  //     const currentMonth = new Date(new Date().setMonth(today.getMonth() - 1));
  //     const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));
    

  //     if (!data.query) {
  //       return
  //     }
  //    // current month and the last of this month 
  //     const currentMonthQuery = query(
  //       collection(db, data.query),
  //       where("timeStamp", "<=", today),
  //       where("timeStamp", ">", currentMonth)
  //     );
  //     // previous month 
  //     const prevMonthQuery = query(
  //       collection(db, data.query),
  //       where("timeStamp", "<=", currentMonth),
  //       where("timeStamp", ">", prevMonth)
  //     );
  //      const currentMonthData = await getDocs(currentMonthQuery);
  //      const prevMonthData = await getDocs(prevMonthQuery);
  //      setAmount(currentMonthData.docs.length);
  //   };
  //   fetchData();
  // }, []);
  useEffect(() => {
    // LISTEN (REALTIME)
    if (!data.query) {
            return
    }
    const unSubscribe = onSnapshot( collection(db, data.query),
      (snapShot) => {
        let usersList = [];
        snapShot.docs.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });

        setAmount(usersList.length);         
      },
      (error) => {
        console.log(error);
      }
    );
   return ()=>{
    unSubscribe()
    }
  }, []);

  return (
    
    <div className="widget  p-[20px]">
       <div className="left">
        <span className="title">{data?.title}</span>
        <span className="counter">
          {data?.isMoney && "$"} {amount}
        </span>
        <span className="link">{data?.link}</span>
      </div>

      <div className="right">
        <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
          {diff < 0 ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/> }
        </div>
        {data?.icon} 
      </div> 
    </div>
  );
};

export default Widget;
