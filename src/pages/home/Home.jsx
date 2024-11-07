import "./home.css";
import Widget from "./widget/Widget";
import Chart from "./chart/Chart";
import Table from "./tableTransaction/Table";
import Test from "./chart/Chart2"
import { auth } from "../../firebase";
import { useEffect } from "react";
// scroll-container 

const Home = () => {
  return (
    <div className="home !relative">
      <div className={`homeContainer   !overflow-auto    `}>
        <div className="widgets  p-[18px] flex-col md:flex-row     md:overflow-x-scroll lg:overflow-hidden  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
          <Widget type="user" />
          <Widget type="product" />
          <Widget type="order" />
          <Widget type="earning" />
        </div>
        <div className="charts">
          <Test/>
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1}  />
        </div>
        <div className="listContainer !md:m-0 lg:m-5 !overflow-x-auto">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
